import sites from "@/data/sites.json";
import { notFound } from "next/navigation";
import Machines from "@/components/pages/Machines";

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
    <Machines
      site={{ id: site.id, name: site.name }}
      department={{ id: dep.id, name: dep.name }}
      machine={machine}
    />
  );
}
