import sites from "@/data/sites.json";
import Link from "next/link";
import { Factory, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className={"flex flex-col gap-8"}>
      <div className={"flex gap-2 flex-col"}>
        <h1 className={"text-3xl font-semibold"}>Sites</h1>
        <h2 className={"text-xl"}>
          Liste des sites industriels monitorés par le système.
        </h2>
      </div>

      <div className={"grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"}>
        {sites.map((site) => (
          <div
            className={"bg-card rounded-lg p-4 flex flex-col gap-2"}
            key={site.uuid}
          >
            <h3 className={"font-semibold text-xl"}>{site.name}</h3>
            <div className={"flex items-center gap-2"}>
              <Factory /> {site.id}
            </div>
            <div className={"flex items-center gap-2"}>
              <MapPin /> {site.location}
            </div>
            <div className={"text-muted text-sm"}>{site.description}</div>
            <Link href={`/sites/${site.id}`}>
              <Button className={"w-full"}>Accéder au site</Button>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
