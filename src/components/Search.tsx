import { useRef, useState } from "react";
import clsx from "clsx";
import { Command } from "cmdk";

import { Chip } from "./ui/Chip";
import { useProjects, type Project } from "~/hooks/useProjects";
import { type Filter, useFilter } from "~/hooks/useFilter";
import { IconButton } from "./ui/Button";
import { ChevronLeft, Search as SearchIcon, X } from "./icons";
import { useLists } from "~/hooks/useLists";
import { useKey } from "react-use";
import { SearchInput } from "./ui/Form";
import { Avatar } from "./ui/Avatar";

type Props = {
  onSelect: (path: string) => void;
};

function useCmdK() {
  const ref = useRef<HTMLInputElement>(null);
  useKey(
    (e) => (e.metaKey ?? e.ctrlKey) && [75, 107].includes(e.keyCode),
    (e) => {
      e.preventDefault();
      ref.current?.focus();
    }
  );
  return ref;
}

export const Search = ({ onSelect }: Props) => {
  const [isOpen, setOpen] = useState(false);
  const [search, setSearch] = useState("");

  const ref = useCmdK();

  // Search does not use pagination, categories and always sorts A to Z
  const filter = {
    sort: "asc",
    categories: [],
    search,
  } as Partial<Filter>;
  const projects = useProjects(
    { ...useFilter("projects").data, ...filter },
    { enabled: search.length > 0 }
  );
  const lists = useLists(
    { ...useFilter("lists").data, ...filter },
    { enabled: search.length > 0 }
  );

  const projectsData = projects.data ?? [];
  const listsData = lists.data ?? [];

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
          <SearchInput
            as={Command.Input}
            ref={ref}
            value={search}
            onValueChange={setSearch}
            className={clsx({ ["hidden"]: !isOpen })}
            placeholder="Search projects or lists..."
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
                      {items.map(
                        (item: {
                          id: string;
                          displayName?: string;
                          listName?: string;
                        }) => (
                          <Command.Item
                            key={`${type}/${item.id}`}
                            value={`/${type}/${item.id}`}
                            className="mt-2 flex cursor-pointer items-center gap-2 rounded-lg p-2 normal-case text-gray-900 hover:bg-gray-100 data-[selected]:bg-gray-100"
                            onSelect={(path) => {
                              setSearch("");
                              onSelect(path);
                            }}
                          >
                            <Avatar
                              className="h-6 w-6"
                              src={
                                (item as Project).profile?.profileImageUrl ?? ""
                              }
                            />
                            {item.displayName ?? item.listName}
                          </Command.Item>
                        )
                      )}
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
