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
  const projects = useProjects({
    ...filter,
    page: 1,
    sort: "asc",
    search,
  });
  const lists = { isLoading: false };

  const projectsList = projects.data?.data ?? [];
  const listsList = [];

  const results = {
    projects: projects.data?.data ?? [],
    lists: [],
  } as const;

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
          {projects.isLoading ?? lists.isLoading ? (
            <Command.Loading>Loading...</Command.Loading>
          ) : !projectsList.length && !listsList.length ? (
            <Command.Empty>No results found.</Command.Empty>
          ) : (
            <>
              {["projects", "lists"].map((type) => {
                const items = results[type as keyof typeof results];
                return items.length ? (
                  <Command.Group
                    key={type}
                    heading={type}
                    className="uppercase text-gray-700"
                  >
                    {items.map((item) => (
                      <Command.Item
                        key={item.id}
                        value={item.id}
                        className="mt-2 flex cursor-pointer items-center gap-2 rounded-lg p-2 normal-case text-gray-900 hover:bg-gray-100 data-[selected]:bg-gray-100"
                        onSelect={(id) => {
                          setSearch("");
                          onSelect("projects", id);
                        }}
                      >
                        <div className="h-6 w-6 bg-gray-200" />
                        {item.displayName}
                      </Command.Item>
                    ))}
                  </Command.Group>
                ) : null;
              })}
            </>
          )}
        </Command.List>
      </Command>
    </div>
  );
};
