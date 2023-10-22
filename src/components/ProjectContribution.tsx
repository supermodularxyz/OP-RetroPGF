import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import Link from "next/link";
import { Link as LinkIcon } from "~/components/icons";
import { Project } from "~/hooks/useProjects";
import { Image } from "./ui/Avatar";

export function ProjectContribution({
  link,
}: {
  link: Project["contributionLinks"][number];
}) {
  const metadata = useQuery(["metadata", link.url], () =>
    axios.get(`/api/preview?url=${link.url}`).then((r) => r.data)
  );

  return (
    <Link key={link.url} href={link.url} target="_blank">
      <div className="space-y-6 rounded-3xl border border-gray-200 p-6">
        <div className="flex items-center gap-4 overflow-auto rounded-xl border border-gray-200">
          <Image
            className="h-20 w-20 flex-shrink-0 rounded-l-xl bg-gray-100"
            title={metadata.data?.title}
            src={metadata.data?.image}
          />
          <div>
            <div className="mb-2 overflow-auto font-semibold text-gray-700">
              {link.description}
            </div>
            <div className="flex items-center gap-1 text-gray-700 hover:underline ">
              <LinkIcon />
              <span className="text-sm font-semibold ">{link.url}</span>
            </div>
          </div>
        </div>
        <p>{link.description}</p>
      </div>
    </Link>
  );
}
