import { useRef, useState } from "react";
import clsx from "clsx";
import { Command } from "cmdk";

import { useProjects } from "~/hooks/useProjects";
import { type Filter, useFilter } from "~/hooks/useFilter";
import { SearchInput } from "../ui/Form";
import { useClickAway } from "react-use";

type Props = {
  onSelect: (path: string) => void;
};

export const SearchProjects = ({ onSelect }: Props) => {
  const searchRef = useRef(null);
  const [isOpen, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  useClickAway(searchRef, () => setOpen(false));

  // Search does not use pagination, categories and always sorts A to Z
  const filter = {
    page: 1,
    sort: "asc",
    categories: [],
    search,
  } as Partial<Filter>;
  const projects = useProjects({ ...useFilter("projects").data, ...filter });

  const projectsData = projects.data?.data ?? [];

  return (
    <div className="flex-1">
      <Command
        ref={searchRef}
        className="flex-1 md:relative"
        shouldFilter={false}
        loop
      >
        <SearchInput
          as={Command.Input}
          value={search}
          onFocus={() => setOpen(true)}
          onKeyDown={() => setOpen(true)}
          onValueChange={setSearch}
          placeholder="Search projects..."
        />

        <Command.List
          className={clsx(
            "absolute left-0 z-10 mt-1 max-h-[300px] w-full overflow-y-scroll rounded-xl bg-white p-2 md:h-auto md:border",
            { ["hidden"]: !isOpen }
          )}
        >
          {projects.isLoading ? (
            <Command.Loading>Loading...</Command.Loading>
          ) : !projectsData.length ? (
            <Command.Empty>No results found.</Command.Empty>
          ) : (
            projectsData?.map((item) => (
              <Command.Item
                key={item.id}
                value={item.id}
                className="mt-2 flex cursor-pointer items-center gap-2 rounded-lg p-2 normal-case text-gray-900 hover:bg-gray-100 data-[selected]:bg-gray-100"
                onSelect={(id) => {
                  setSearch("");
                  setOpen(false);
                  onSelect(id);
                  console.log(id);
                }}
              >
                <div className="h-6 w-6 bg-gray-200" />
                {item.displayName}
              </Command.Item>
            ))
          )}
        </Command.List>
      </Command>
    </div>
  );
};
