import { type ReactNode, useMemo } from "react";
import { tv } from "tailwind-variants";
import Link from "next/link";
import { useFieldArray, useFormContext } from "react-hook-form";

import { createComponent } from "./ui";
import { Avatar } from "./ui/Avatar";
import { Table, Tbody, Tr, Td } from "./ui/Table";
import { IconButton } from "./ui/Button";
import { Trash } from "./icons";
import { type Project, sortAndFilter, useProject } from "~/hooks/useProjects";
import { type Filter } from "~/hooks/useFilter";
import { type List } from "~/hooks/useLists";
import { formatNumber } from "~/utils/formatNumber";
import { AllocationInput } from "./AllocationInput";
import { useBallotProjectData } from "~/hooks/useBallot";

type Allocation = Project & { amount: number };

const AllocationListWrapper = createComponent(
  "div",
  tv({ base: "flex flex-col gap-2 flex-1" })
);

type Props = { allocations: Allocation[] };

export const AllocationList = ({ allocations }: Props) => (
  <AllocationListWrapper>
    <Table>
      <Tbody>
        {allocations.map((project) => (
          <Tr key={project.id}>
            <Td className={"w-full"}>
              <ProjectAvatarWithName id={project.id} subtitle="@project" />
            </Td>
            <Td className="whitespace-nowrap">
              {formatNumber(project.amount)} OP
            </Td>
          </Tr>
        ))}
      </Tbody>
    </Table>
  </AllocationListWrapper>
);

export function AllocationForm({
  list,
  header,
  filter,
  onSave,
}: {
  list?: List[];
  header?: ReactNode;
  filter: Partial<Filter>;
  onSave?: (v: { allocations: Allocation[] }) => void;
}) {
  const form = useFormContext<{ allocations: Allocation[] }>();

  const { fields, remove } = useFieldArray({
    name: "allocations",
    keyName: "key",
    control: form.control,
  });
  const mapProjectData = useBallotProjectData();

  // Map each id to the index so we can sort and filter
  const indexes = new Map(fields.map(({ key }, index) => [key, index]));

  // TODO: Merge fields with data in QueryData(["projects", id])
  const sortedFields = useMemo(
    () => sortAndFilter(mapProjectData(fields), filter),
    [fields, filter, mapProjectData]
  );

  return (
    <AllocationListWrapper>
      <Table>
        {header}
        <Tbody>
          {sortedFields.map((project, i) => {
            const idx = indexes.get(project.key)!;

            // TODO: Get allocated amount from list
            // Depends on https://github.com/supermodularxyz/OP-RetroPGF/issues/37
            // const listAllocation = list?.find((l) => l.listContent.find((p) => p.id === project.id));
            const listAllocation = 100;

            return (
              <Tr key={project.key}>
                <Td className={"w-full"}>
                  <ProjectAvatarWithName id={project.id} />
                </Td>
                {list ? (
                  <Td>
                    <AllocationInput
                      defaultValue={listAllocation}
                      disabled={true}
                    />
                  </Td>
                ) : null}
                <Td>
                  <AllocationInput
                    {...form.register(`allocations.${idx}.amount`, {
                      valueAsNumber: true,
                      onBlur: () => onSave?.(form.getValues()),
                    })}
                  />
                </Td>
                <Td>
                  <IconButton
                    tabIndex={-1}
                    type="button"
                    variant="outline"
                    icon={Trash}
                    onClick={() => {
                      remove(idx);
                      onSave?.(form.getValues());
                    }}
                  />
                </Td>
              </Tr>
            );
          })}
        </Tbody>
      </Table>
      <button type="submit" className="hidden" />
    </AllocationListWrapper>
  );
}

const ProjectAvatarWithName = ({
  id,
  subtitle,
}: {
  id: string;
  subtitle?: string;
}) => {
  const { data: project } = useProject(id);
  return (
    <Link
      tabIndex={-1}
      className="flex flex-1 items-center gap-2 py-1 hover:underline"
      href={`/projects/${project?.id}`}
    >
      <Avatar size="sm" />
      <div>
        <div className="whitespace-nowrap font-bold">
          {project?.displayName}
        </div>
        <div className="text-muted">{subtitle}</div>
      </div>
    </Link>
  );
};
