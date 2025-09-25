"use client";

import Link from "next/link";
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
  BarChart3,
  Clock,
  Gauge,
  Thermometer,
  TrendingUp,
  Wrench,
  Zap,
} from "lucide-react";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Area, AreaChart, Line, LineChart, XAxis, YAxis } from "recharts";

type Site = {
  id: string;
  name: string;
};

type Department = {
  id: string;
  name: string;
};

type Machine = {
  id: string;
  name: string;
  status: boolean;
  uptimeHours: number;
  power_kw: number;
  temperature_c: number;
  pressure_bar: number;
  production_units: number;
  energy_cost_cad: number;
  alerts: Array<{
    id: string;
    severity: string;
    message: string;
  }>;
  telemetry: {
    vibration: number;
    temperatureHistory: number[];
    powerHistory: number[];
    pressureHistory: number[];
    vibrationHistory: number[];
    productionRate: number[];
    efficiency: number[];
  };
  maintenance: {
    lastService: string;
    nextDue: string;
    type: string;
  };
};

type MachinesProps = {
  site: Site;
  department: Department;
  machine: Machine;
};

const severityToName = {
  HIGH: "Élevée",
  MEDIUM: "Moyenne",
  LOW: "Faible",
};

export default function Machines({ site, department, machine }: MachinesProps) {
  const temperatureData = machine.telemetry.temperatureHistory
    .map((temp, index) => ({
      time: `T-${3 - index}`,
      temperature: temp,
    }))
    .concat([
      {
        time: "Maintenant",
        temperature: machine.temperature_c,
      },
    ]);

  const powerData = machine.telemetry.powerHistory
    .map((power, index) => ({
      time: `T-${3 - index}`,
      power: power,
    }))
    .concat([
      {
        time: "Maintenant",
        power: machine.power_kw,
      },
    ]);

  const vibrationData = machine.telemetry.vibrationHistory
    .map((vibration, index) => ({
      time: `T-${3 - index}`,
      vibration: vibration,
    }))
    .concat([
      {
        time: "Maintenant",
        vibration: machine.telemetry.vibration,
      },
    ]);

  const productionData = machine.telemetry.productionRate
    .map((rate, index) => ({
      time: `T-${3 - index}`,
      rate: rate,
    }))
    .concat([
      {
        time: "Maintenant",
        rate: machine.telemetry.productionRate[
          machine.telemetry.productionRate.length - 1
        ],
      },
    ]);

  const efficiencyData = machine.telemetry.efficiency
    .map((efficiency, index) => ({
      time: `T-${3 - index}`,
      efficiency: efficiency,
    }))
    .concat([
      {
        time: "Maintenant",
        efficiency:
          machine.telemetry.efficiency[machine.telemetry.efficiency.length - 1],
      },
    ]);

  const pressureData = machine.telemetry.pressureHistory
    .map((pressure, index) => ({
      time: `T-${3 - index}`,
      pressure: pressure,
    }))
    .concat([
      {
        time: "Maintenant",
        pressure: machine.pressure_bar,
      },
    ]);

  return (
    <div className={"flex flex-col gap-8"}>
      <div className={"flex gap-2 flex-col"}>
        <h1 className={"text-3xl font-semibold"}>Machine {machine.name}</h1>
        <h2 className={"text-xl"}>
          Détails de la machine {machine.name} du département {department.name}.
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
              <Link href={`/sites/${site.id}/${department.id}`}>
                {department.name}
              </Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href={`/sites/${site.id}/${department.id}/${machine.id}`}>
                {machine.name}
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

      <div className={"grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"}>
        <div className={"bg-card rounded-lg p-4 flex flex-col gap-2"}>
          <div className={"flex items-center gap-2"}>
            <Thermometer className={"h-5 w-5 text-primary"} />
            <h3 className={"font-semibold text-lg"}>Température</h3>
          </div>
          <p className={"text-2xl font-bold"}>{machine.temperature_c}°C</p>
          <ChartContainer
            config={{
              temperature: {
                label: "Température",
                color: "var(--chart-1)",
              },
            }}
            className="h-20"
          >
            <AreaChart data={temperatureData}>
              <XAxis dataKey="time" hide />
              <YAxis hide />
              <ChartTooltip
                content={
                  <ChartTooltipContent
                    formatter={(value) => `${value}°C`}
                    labelFormatter={(label) => `Temps: ${label}`}
                  />
                }
                cursor={false}
              />
              <Area
                dataKey="temperature"
                fill="var(--color-temperature)"
                stroke="var(--color-temperature)"
                strokeWidth={2}
                fillOpacity={0.3}
              />
            </AreaChart>
          </ChartContainer>
        </div>

        <div className={"bg-card rounded-lg p-4 flex flex-col gap-2"}>
          <div className={"flex items-center gap-2"}>
            <Zap className={"h-5 w-5 text-primary"} />
            <h3 className={"font-semibold text-lg"}>Puissance</h3>
          </div>
          <p className={"text-2xl font-bold"}>{machine.power_kw} kW</p>
          <ChartContainer
            config={{
              power: {
                label: "Puissance",
                color: "var(--chart-1)",
              },
            }}
            className="h-20"
          >
            <LineChart data={powerData}>
              <XAxis dataKey="time" hide />
              <YAxis hide />
              <ChartTooltip
                content={
                  <ChartTooltipContent
                    formatter={(value) => `${value} kW`}
                    labelFormatter={(label) => `Temps: ${label}`}
                  />
                }
                cursor={false}
              />
              <Line
                dataKey="power"
                stroke="var(--color-power)"
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ChartContainer>
        </div>

        <div className={"bg-card rounded-lg p-4 flex flex-col gap-2"}>
          <div className={"flex items-center gap-2"}>
            <Gauge className={"h-5 w-5 text-primary"} />
            <h3 className={"font-semibold text-lg"}>Vibrations</h3>
          </div>
          <p className={"text-2xl font-bold"}>
            {machine.telemetry.vibration} mm/s
          </p>
          <ChartContainer
            config={{
              vibration: {
                label: "Vibrations",
                color: "var(--chart-1)",
              },
            }}
            className="h-20"
          >
            <LineChart data={vibrationData}>
              <XAxis dataKey="time" hide />
              <YAxis hide />
              <ChartTooltip
                content={
                  <ChartTooltipContent
                    formatter={(value) => `${value} mm/s`}
                    labelFormatter={(label) => `Temps: ${label}`}
                  />
                }
                cursor={false}
              />
              <Line
                dataKey="vibration"
                stroke="var(--color-vibration)"
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ChartContainer>
        </div>

        <div className={"bg-card rounded-lg p-4 flex flex-col gap-2"}>
          <div className={"flex items-center gap-2"}>
            <BarChart3 className={"h-5 w-5 text-primary"} />
            <h3 className={"font-semibold text-lg"}>Taux de Production</h3>
          </div>
          <p className={"text-2xl font-bold"}>
            {
              machine.telemetry.productionRate[
                machine.telemetry.productionRate.length - 1
              ]
            }{" "}
            unité/h
          </p>
          <ChartContainer
            config={{
              rate: {
                label: "Taux de Production",
                color: "var(--chart-1)",
              },
            }}
            className="h-20"
          >
            <AreaChart data={productionData}>
              <XAxis dataKey="time" hide />
              <YAxis hide />
              <ChartTooltip
                content={
                  <ChartTooltipContent
                    formatter={(value) => `${value} u/h`}
                    labelFormatter={(label) => `Temps: ${label}`}
                  />
                }
                cursor={false}
              />
              <Area
                dataKey="rate"
                fill="var(--color-rate)"
                stroke="var(--color-rate)"
                strokeWidth={2}
                fillOpacity={0.4}
              />
            </AreaChart>
          </ChartContainer>
        </div>

        <div className={"bg-card rounded-lg p-4 flex flex-col gap-2"}>
          <div className={"flex items-center gap-2"}>
            <TrendingUp className={"h-5 w-5 text-primary"} />
            <h3 className={"font-semibold text-lg"}>Efficacité</h3>
          </div>
          <p className={"text-2xl font-bold"}>
            {
              machine.telemetry.efficiency[
                machine.telemetry.efficiency.length - 1
              ]
            }
            %
          </p>
          <ChartContainer
            config={{
              efficiency: {
                label: "Efficacité",
                color: "var(--chart-1)",
              },
            }}
            className="h-20"
          >
            <LineChart data={efficiencyData}>
              <XAxis dataKey="time" hide />
              <YAxis hide />
              <ChartTooltip
                content={
                  <ChartTooltipContent
                    formatter={(value) => `${value}%`}
                    labelFormatter={(label) => `Temps: ${label}`}
                  />
                }
                cursor={false}
              />
              <Line
                dataKey="efficiency"
                stroke="var(--color-efficiency)"
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ChartContainer>
        </div>

        <div className={"bg-card rounded-lg p-4 flex flex-col gap-2"}>
          <div className={"flex items-center gap-2"}>
            <TrendingUp className={"h-5 w-5 text-primary"} />
            <h3 className={"font-semibold text-lg"}>Pression</h3>
          </div>
          <p className={"text-2xl font-bold"}>{machine.pressure_bar} bar</p>
          <ChartContainer
            config={{
              pressure: {
                label: "Pression",
                color: "var(--chart-1)",
              },
            }}
            className="h-20"
          >
            <LineChart data={pressureData}>
              <XAxis dataKey="time" hide />
              <YAxis hide />
              <ChartTooltip
                content={
                  <ChartTooltipContent
                    formatter={(value) => `${value} bar`}
                    labelFormatter={(label) => `Temps: ${label}`}
                  />
                }
                cursor={false}
              />
              <Line
                dataKey="pressure"
                stroke="var(--chart-1)"
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ChartContainer>
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

      <div className={"bg-card rounded-lg p-6"}>
        <h3 className={"font-semibold text-xl mb-4 flex items-center gap-2"}>
          <Wrench className={"h-6 w-6 text-primary"} />
          Informations de Maintenance
        </h3>
        <div className={"grid grid-cols-1 md:grid-cols-3 gap-4"}>
          <div>
            <p className={"text-sm text-muted-foreground"}>Dernier Service</p>
            <p className={"font-medium"}>
              {new Date(machine.maintenance.lastService).toLocaleDateString(
                "fr-CA",
              )}
            </p>
          </div>
          <div>
            <p className={"text-sm text-muted-foreground"}>Prochain Service</p>
            <p className={"font-medium"}>
              {new Date(machine.maintenance.nextDue).toLocaleDateString(
                "fr-CA",
              )}
            </p>
          </div>
          <div>
            <p className={"text-sm text-muted-foreground"}>Type</p>
            <p className={"font-medium capitalize"}>
              {machine.maintenance.type}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
