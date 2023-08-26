import { useState } from "react";
import clsx from "clsx";
import { Command } from "cmdk";

import { Chip } from "./ui/Chip";
import { useProjects } from "~/hooks/useProjects";
import { type Filter, useFilter } from "~/hooks/useFilter";
import { IconButton } from "./ui/Button";
import { ChevronLeft, Search as SearchIcon, X } from "./icons";
import { useLists } from "~/hooks/useLists";

type Props = {
  onSelect: (path: string) => void;
};

export const Search = ({ onSelect }: Props) => {
  const [isOpen, setOpen] = useState(false);
  const [search, setSearch] = useState("");

  // Search does not use pagination and always sorts A to Z
  const filter = { page: 1, sort: "asc", search } as Partial<Filter>;
  const projects = useProjects({ ...useFilter("projects").data, ...filter });
  const lists = useLists({ ...useFilter("lists").data, ...filter });

  const projectsData = projects.data?.data ?? [];
  const listsData = lists.data?.data ?? [];

  const results = { projects: projectsData, lists: listsData } as const;

  return (
    <div className="flex justify-end">
      <Chip className="md:hidden" onClick={() => setOpen(true)}>
        <SearchIcon className="h-4 w-4" />
      </Chip>
      <div
        className={clsx(
          "absolute left-0 top-0 z-10 flex h-[72px] w-full items-center bg-white md:relative md:!flex md:h-auto",
          {
            ["hidden"]: !isOpen,
          }
        )}
      >
        <IconButton
          icon={ChevronLeft}
          variant="ghost"
          onClick={() => setOpen(false)}
          className={clsx("text-gray-600 md:hidden")}
        />
        <Command className="flex-1 md:relative" shouldFilter={false} loop>
          <Command.Input
            value={search}
            onValueChange={setSearch}
            className={clsx(
              "focus-visible:ring-ring h-full w-full rounded-xl p-3 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 md:flex md:h-auto md:border",
              {
                ["hidden"]: !isOpen,
              }
            )}
            placeholder="Search projects or lists"
          />

          <Command.List
            className={clsx(
              "absolute left-0 mt-1 h-screen w-full rounded-xl bg-white p-2 md:h-auto md:border",
              {
                ["hidden"]: !Boolean(search),
              }
            )}
          >
            {projects.isLoading ?? lists.isLoading ? (
              <Command.Loading>Loading...</Command.Loading>
            ) : !projectsData.length && !listsData.length ? (
              <Command.Empty>No results found.</Command.Empty>
            ) : (
              <>
                {(["projects", "lists"] as const).map((type) => {
                  const items = results[type];
                  return items.length ? (
                    <Command.Group
                      key={type}
                      heading={type}
                      className="uppercase text-gray-700"
                    >
                      {items.map((item) => (
                        <Command.Item
                          key={`${type}/${item.id}`}
                          value={`/${type}/${item.id}`}
                          className="mt-2 flex cursor-pointer items-center gap-2 rounded-lg p-2 normal-case text-gray-900 hover:bg-gray-100 data-[selected]:bg-gray-100"
                          onSelect={(path) => {
                            setSearch("");
                            onSelect(path);
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
        <IconButton
          icon={X}
          variant="ghost"
          onClick={() => setOpen(false)}
          className={clsx("text-gray-600 md:hidden")}
        />
      </div>
    </div>
  );
};
