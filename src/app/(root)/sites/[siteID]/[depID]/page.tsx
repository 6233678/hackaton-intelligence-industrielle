import sites from "@/data/sites.json";
import Link from "next/link";
import { Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { notFound } from "next/navigation";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { cn } from "@/lib/utils";

type TParams = {
  readonly siteID: string;
  readonly depID: string;
};

export default async function Department(props: {
  readonly params: Promise<TParams>;
}) {
  const params = await props.params;

  const site = sites.find((site) => site.id === params.siteID);

  if (!site) return notFound();

  const dep = site.departments.find((dep) => dep.id === params.depID);

  if (!dep) return notFound();

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
          <h3 className={"font-semibold text-lg"}>Machines Totales</h3>
          <p className={"text-3xl font-bold"}>{totalMachines}</p>
        </div>
        <div className={"bg-card rounded-lg p-4 flex flex-col gap-2"}>
          <h3 className={"font-semibold text-lg"}>Machines Actives</h3>
          <p className={"text-3xl font-bold"}>{activeMachines}</p>
        </div>
        <div className={"bg-card rounded-lg p-4 flex flex-col gap-2"}>
          <h3 className={"font-semibold text-lg"}>Production Totale</h3>
          <p className={"text-3xl font-bold"}>
            {totalProduction.toLocaleString()}
          </p>
        </div>
        <div className={"bg-card rounded-lg p-4 flex flex-col gap-2"}>
          <h3 className={"font-semibold text-lg"}>Coût Énergétique</h3>
          <p className={"text-3xl font-bold"}>
            {totalEnergyCost.toLocaleString()} CAD
          </p>
        </div>
      </div>

      <div className={"grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"}>
        {dep.machines.map((machine) => (
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
    </div>
  );
}
