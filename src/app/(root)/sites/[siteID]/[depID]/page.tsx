"use client";

import sites from "@/data/sites.json";
import Link from "next/link";
import { Activity, Search, TrendingUp, Users, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { notFound } from "next/navigation";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { use, useState } from "react";

type TParams = {
  readonly siteID: string;
  readonly depID: string;
};

type SortOption = "name" | "status" | "uptime" | "production" | "energy";

export default function Department({ params }: { params: Promise<TParams> }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<SortOption>("name");

  const resolvedParams = use(params);

  const site = sites.find((site) => site.id === resolvedParams.siteID);

  if (!site) return notFound();

  const dep = site.departments.find((dep) => dep.id === resolvedParams.depID);

  if (!dep) return notFound();

  // Filter machines based on search term
  const filteredMachines = dep.machines.filter((machine) =>
    machine.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  // Sort machines based on selected option
  const sortedMachines = [...filteredMachines].sort((a, b) => {
    switch (sortBy) {
      case "name":
        return a.name.localeCompare(b.name);
      case "status":
        return Number(b.status) - Number(a.status);
      case "uptime":
        return b.uptimeHours - a.uptimeHours;
      case "production":
        return b.production_units - a.production_units;
      case "energy":
        return b.energy_cost_cad - a.energy_cost_cad;
      default:
        return 0;
    }
  });

  // Calculate department statistics
  const totalMachines = dep.machines.length;
  const activeMachines = dep.machines.filter(
    (machine) => machine.status,
  ).length;
  const totalProduction = dep.machines.reduce(
    (sum, machine) => sum + machine.production_units,
    0,
  );
  const totalEnergyCost = dep.machines.reduce(
    (sum, machine) => sum + machine.energy_cost_cad,
    0,
  );

  return (
    <div className={"flex flex-col gap-8"}>
      <div className={"flex gap-2 flex-col"}>
        <h1 className={"text-3xl font-semibold"}>Machines</h1>
        <h2 className={"text-xl"}>
          Liste des machines du département {dep.name}.
        </h2>
      </div>

      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/">Sites</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href={`/sites/${site.id}`}>{site.name}</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href={`/sites/${site.id}/${dep.id}`}>{dep.name}</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className={"grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"}>
        <div className={"bg-card rounded-lg p-4 flex flex-col gap-2"}>
          <div className={"flex items-center gap-2"}>
            <Activity className={"h-5 w-5 text-primary"} />
            <h3 className={"font-semibold text-lg"}>Machines Totales</h3>
          </div>
          <p className={"text-3xl font-bold"}>{totalMachines}</p>
        </div>
        <div className={"bg-card rounded-lg p-4 flex flex-col gap-2"}>
          <div className={"flex items-center gap-2"}>
            <Activity className={"h-5 w-5 text-primary"} />
            <h3 className={"font-semibold text-lg"}>Machines Actives</h3>
          </div>
          <p className={"text-3xl font-bold"}>{activeMachines}</p>
        </div>
        <div className={"bg-card rounded-lg p-4 flex flex-col gap-2"}>
          <div className={"flex items-center gap-2"}>
            <TrendingUp className={"h-5 w-5 text-primary"} />
            <h3 className={"font-semibold text-lg"}>Production Totale</h3>
          </div>
          <p className={"text-3xl font-bold"}>
            {totalProduction.toLocaleString()}
          </p>
        </div>
        <div className={"bg-card rounded-lg p-4 flex flex-col gap-2"}>
          <div className={"flex items-center gap-2"}>
            <Zap className={"h-5 w-5 text-primary"} />
            <h3 className={"font-semibold text-lg"}>Coût Énergétique</h3>
          </div>
          <p className={"text-3xl font-bold"}>
            {totalEnergyCost.toLocaleString()} CAD
          </p>
        </div>
      </div>

      <div className={"flex flex-col gap-4"}>
        <div
          className={
            "flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between"
          }
        >
          <div className={"relative max-w-md flex-1"}>
            <Search
              className={
                "absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted"
              }
            />
            <Input
              placeholder="Rechercher une machine..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={"pl-10"}
            />
          </div>
          <div className={"flex items-center gap-2 min-w-0"}>
            <span className={"text-sm text-muted whitespace-nowrap"}>
              Trier par:
            </span>
            <Select
              value={sortBy}
              onValueChange={(value: SortOption) => setSortBy(value)}
            >
              <SelectTrigger className={"w-[200px]"}>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="name">Nom</SelectItem>
                <SelectItem value="status">Statut</SelectItem>
                <SelectItem value="uptime">Temps de fonctionnement</SelectItem>
                <SelectItem value="production">Production</SelectItem>
                <SelectItem value="energy">Coût énergétique</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className={"grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"}>
          {sortedMachines.map((machine) => (
            <div
              className={"bg-card rounded-lg p-4 flex flex-col gap-2"}
              key={machine.uuid}
            >
              <h3 className={"font-semibold text-xl flex gap-2 items-center"}>
                <div
                  className={cn(
                    "rounded-full h-5 w-5",
                    machine.status ? "bg-green-400" : "bg-red-400",
                  )}
                />{" "}
                {machine.name}
              </h3>
              <div className={"flex items-center gap-2"}>
                <Users /> {machine.id}
              </div>
              <Link href={`/sites/${site.id}/${dep.id}/${machine.id}`}>
                <Button className={"w-full"}>Accéder à la machine</Button>
              </Link>
            </div>
          ))}
        </div>

        {sortedMachines.length === 0 && searchTerm && (
          <div className={"text-center py-8 text-muted-foreground"}>
            Aucune machine trouvée pour &#34;{searchTerm}&#34;
          </div>
        )}
      </div>
    </div>
  );
}
