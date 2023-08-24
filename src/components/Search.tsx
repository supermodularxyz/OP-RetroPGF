import { useState } from "react";
import { Chip } from "./ui/Chip";
import { Command } from "cmdk";
import { useProjects } from "~/hooks/useProjects";
import { useFilter } from "~/hooks/useFilter";
import clsx from "clsx";

export const Search = ({
  onSelect,
}: {
  onSelect: (type: "projects" | "lists", id: string) => void;
}) => {
  const [search, setSearch] = useState("");
  const { data: filter } = useFilter();
  const { data: projects, isLoading } = useProjects({
    ...filter,
    page: 1,
    sort: "asc",
    search,
  });

  return (
    <div className="flex justify-end">
      <div>
        <Chip className="md:hidden">S</Chip>
      </div>
      <Command className="relative flex-1" shouldFilter={false} loop>
        <Command.Input
          value={search}
          onValueChange={setSearch}
          className="hidden w-full rounded-xl border p-3 md:flex"
          placeholder="Search projects or lists"
        />

        <Command.List
          className={clsx(
            "absolute mt-1 w-full rounded-xl border bg-white p-2",
            {
              ["hidden"]: !Boolean(search),
            }
          )}
        >
          {isLoading ? (
            <Command.Loading>Loading...</Command.Loading>
          ) : !projects?.data.length ? (
            <Command.Empty>No results found.</Command.Empty>
          ) : (
            <Command.Group
              heading="Projects"
              className="uppercase text-gray-700"
            >
              {projects?.data?.map((project) => {
                console.log("p", project);
                return (
                  <Command.Item
                    key={project.id}
                    value={project.id}
                    className="mt-2 flex cursor-pointer items-center gap-2 rounded-lg p-2 normal-case text-gray-900 hover:bg-gray-100 data-[selected]:bg-gray-100"
                    onSelect={(id) => {
                      setSearch("");
                      onSelect("projects", id);
                    }}
                  >
                    <div className="h-6 w-6 bg-gray-200" />
                    {project.displayName}
                  </Command.Item>
                );
              })}
            </Command.Group>
          )}
        </Command.List>
      </Command>
    </div>
  );
};
