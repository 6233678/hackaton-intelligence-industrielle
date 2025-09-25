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

type TParams = {
  readonly siteID: string;
  readonly depID: string;
  readonly machineID: string;
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
    </div>
  );
}
