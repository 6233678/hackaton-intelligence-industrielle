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

type TParams = {
  readonly siteID: string;
};

export default async function Site(props: {
  readonly params: Promise<TParams>;
}) {
  const params = await props.params;

  const site = sites.find((site) => site.id === params.siteID);

  if (!site) return notFound();

  return (
    <div className={"flex flex-col gap-8"}>
      <div className={"flex gap-2 flex-col"}>
        <h1 className={"text-3xl font-semibold"}>Départements</h1>
        <h2 className={"text-xl"}>
          Liste des départements du site {site.name}.
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
        </BreadcrumbList>
      </Breadcrumb>

      <div className={"grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"}>
        {site.departments.map((dep) => (
          <div
            className={"bg-card rounded-lg p-4 flex flex-col gap-2"}
            key={dep.uuid}
          >
            <h3 className={"font-semibold text-xl"}>{dep.name}</h3>
            <div className={"flex items-center gap-2"}>
              <Users /> {dep.id}
            </div>
            <div className={"text-muted text-sm"}>{dep.description}</div>
            <Link href={`/sites/${site.id}/${dep.id}`}>
              <Button className={"w-full"}>Accéder au département</Button>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
