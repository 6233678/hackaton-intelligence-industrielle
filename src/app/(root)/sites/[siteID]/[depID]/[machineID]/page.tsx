import sites from "@/data/sites.json";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { cn } from "@/lib/utils";
import {
  Activity,
  AlertTriangle,
  Clock,
  Thermometer,
  TrendingUp,
  Wrench,
  Zap,
} from "lucide-react";

type TParams = {
  readonly siteID: string;
  readonly depID: string;
  readonly machineID: string;
};

const severityToName = {
  HIGH: "Élevée",
  MEDIUM: "Moyenne",
  LOW: "Faible",
};

export default async function Machine(props: {
  readonly params: Promise<TParams>;
}) {
  const params = await props.params;

  const site = sites.find((site) => site.id === params.siteID);

  if (!site) return notFound();

  const dep = site.departments.find((dep) => dep.id === params.depID);

  if (!dep) return notFound();

  const machine = dep.machines.find(
    (machine) => machine.id === params.machineID,
  );

  if (!machine) return notFound();

  return (
    <div className={"flex flex-col gap-8"}>
      <div className={"flex gap-2 flex-col"}>
        <h1 className={"text-3xl font-semibold"}>Machine {machine.name}</h1>
        <h2 className={"text-xl"}>
          Détails de la machine {machine.name} du département {dep.name}.
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
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href={`/sites/${site.id}/${dep.id}/${machine.id}`}>
                {dep.name}
              </Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className={"grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"}>
        <div className={"bg-card rounded-lg p-4 flex flex-col gap-2"}>
          <div className={"flex items-center gap-2"}>
            <Activity className={"h-5 w-5 text-primary"} />
            <h3 className={"font-semibold text-lg"}>Statut</h3>
          </div>
          <div className={"flex items-center gap-2"}>
            <div
              className={cn(
                "rounded-full h-3 w-3",
                machine.status ? "bg-green-400" : "bg-red-400",
              )}
            />
            <p className={"text-2xl font-bold"}>
              {machine.status ? "Actif" : "Arrêté"}
            </p>
          </div>
        </div>

        <div className={"bg-card rounded-lg p-4 flex flex-col gap-2"}>
          <div className={"flex items-center gap-2"}>
            <Clock className={"h-5 w-5 text-primary"} />
            <h3 className={"font-semibold text-lg"}>Temps de marche</h3>
          </div>
          <p className={"text-2xl font-bold"}>
            {machine.uptimeHours.toLocaleString()}h
          </p>
        </div>

        <div className={"bg-card rounded-lg p-4 flex flex-col gap-2"}>
          <div className={"flex items-center gap-2"}>
            <TrendingUp className={"h-5 w-5 text-primary"} />
            <h3 className={"font-semibold text-lg"}>Production</h3>
          </div>
          <p className={"text-2xl font-bold"}>
            {machine.production_units.toLocaleString()}
          </p>
        </div>

        <div className={"bg-card rounded-lg p-4 flex flex-col gap-2"}>
          <div className={"flex items-center gap-2"}>
            <AlertTriangle className={"h-5 w-5 text-primary"} />
            <h3 className={"font-semibold text-lg"}>Alertes</h3>
          </div>
          <p
            className={cn(
              "text-2xl font-bold",
              machine.alerts.length > 0 ? "text-red-500" : "",
            )}
          >
            {machine.alerts.length}
          </p>
        </div>
      </div>

      <div className={"grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"}>
        <div className={"bg-card rounded-lg p-4 flex flex-col gap-2"}>
          <div className={"flex items-center gap-2"}>
            <Thermometer className={"h-5 w-5 text-primary"} />
            <h3 className={"font-semibold text-lg"}>Température</h3>
          </div>
          <p className={"text-2xl font-bold "}>{machine.temperature_c}°C</p>
          <div
            className={
              "h-20 bg-muted rounded flex items-center justify-center text-muted-foreground"
            }
          >
            Graphique température (à venir)
          </div>
        </div>

        <div className={"bg-card rounded-lg p-4 flex flex-col gap-2"}>
          <div className={"flex items-center gap-2"}>
            <Zap className={"h-5 w-5 text-primary"} />
            <h3 className={"font-semibold text-lg"}>Puissance</h3>
          </div>
          <p className={"text-2xl font-bold "}>{machine.power_kw} kW</p>
          <div
            className={
              "h-20 bg-muted rounded flex items-center justify-center text-muted-foreground"
            }
          >
            Graphique puissance (à venir)
          </div>
        </div>

        <div className={"bg-card rounded-lg p-4 flex flex-col gap-2"}>
          <div className={"flex items-center gap-2"}>
            <TrendingUp className={"h-5 w-5 text-primary"} />
            <h3 className={"font-semibold text-lg"}>Coût Énergétique</h3>
          </div>
          <p className={"text-2xl font-bold "}>
            {machine.energy_cost_cad.toLocaleString()} CAD
          </p>
          <div
            className={
              "h-20 bg-muted rounded flex items-center justify-center text-muted-foreground"
            }
          >
            Graphique coûts (à venir)
          </div>
        </div>
      </div>

      {machine.alerts.length > 0 && (
        <div className={"bg-card rounded-lg p-6"}>
          <h3 className={"font-semibold text-xl mb-4 flex items-center gap-2"}>
            <AlertTriangle className={"h-6 w-6 text-primary"} />
            Alertes Actives
          </h3>
          <div className={"flex flex-col gap-3"}>
            {machine.alerts.map((alert) => (
              <div
                key={alert.id}
                className={cn(
                  "p-3 bg-background rounded-lg border-l-4",
                  alert.severity === "HIGH" && "border-red-500",
                  alert.severity === "MEDIUM" && "border-yellow-500",
                  alert.severity === "LOW" && "border-blue-500",
                )}
              >
                <div className={"flex justify-between items-start"}>
                  <p className={"font-medium"}>{alert.message}</p>
                  <span
                    className={cn(
                      "px-2 py-1 rounded text-xs font-semibold uppercase",
                      alert.severity === "HIGH" && "bg-red-200 text-red-800",
                      alert.severity === "MEDIUM" &&
                        "bg-yellow-200 text-yellow-800",
                      alert.severity === "LOW" && "bg-blue-200 text-blue-800",
                    )}
                  >
                    {
                      severityToName[
                        alert.severity as keyof typeof severityToName
                      ]
                    }
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Maintenance Info */}
      <div className={"bg-card rounded-lg p-6"}>
        <h3 className={"font-semibold text-xl mb-4 flex items-center gap-2"}>
          <Wrench className={"h-6 w-6 text-primary"} />
          Maintenance
        </h3>
        <div className={"grid grid-cols-1 sm:grid-cols-3 gap-4"}>
          <div>
            <p className={"text-sm text-muted-foreground"}>Dernier service</p>
            <p className={"font-semibold"}>{machine.maintenance.lastService}</p>
          </div>
          <div>
            <p className={"text-sm text-muted-foreground"}>Prochain service</p>
            <p className={"font-semibold"}>{machine.maintenance.nextDue}</p>
          </div>
          <div>
            <p className={"text-sm text-muted-foreground"}>Type</p>
            <p className={"font-semibold capitalize"}>
              {machine.maintenance.type}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
