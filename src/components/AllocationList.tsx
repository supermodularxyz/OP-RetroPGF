import { type ReactNode, useMemo } from "react";
import { tv } from "tailwind-variants";
import Link from "next/link";
import { useFieldArray, useFormContext } from "react-hook-form";
import { createComponent } from "./ui";
import { Avatar } from "./ui/Avatar";
import { Table, Tbody, Tr, Td } from "./ui/Table";
import { IconButton } from "./ui/Button";
import { Trash } from "./icons";
import { sortAndFilter, useProject } from "~/hooks/useProjects";
import { type Filter } from "~/hooks/useFilter";
import { AllocationInput } from "./AllocationInput";
import { type Allocation } from "~/hooks/useBallot";
import { useBallotProjectData } from "~/hooks/useBallot";
import { formatNumber } from "~/utils/formatNumber";
import { SearchProjects } from "./CreateList/SearchProjects";

const AllocationListWrapper = createComponent(
  "div",
  tv({ base: "flex flex-col gap-2 flex-1" })
);
export const AllocationList = ({
  allocations,
}: {
  allocations: Allocation[];
}) => (
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
  list?: Allocation[];
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
          {sortedFields.map((project) => {
            const idx = indexes.get(project.key)!;

            // TODO: Get allocated amount from list
            // Depends on https://github.com/supermodularxyz/OP-RetroPGF/issues/37
            const listAllocation =
              list?.find((p) => p.id === project.id)?.amount ?? 0;

            return (
              <Tr key={project.key}>
                <Td className={"w-full"}>
                  <ProjectAvatarWithName id={project.id} />
                </Td>
                <Td>
                  {listAllocation ? (
                    <AllocationInput
                      name="amount"
                      defaultValue={listAllocation}
                      disabled={true}
                    />
                  ) : null}
                </Td>
                <Td>
                  <AllocationInput
                    name={`allocations.${idx}.amount`}
                    onBlur={() => onSave?.(form.getValues())}
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

export function AllocationFormWithSearch({
  onSave,
}: {
  onSave?: (v: { allocations: Allocation[] }) => void;
}) {
  const form = useFormContext<{ allocations: Allocation[] }>();

  const { fields, append, remove } = useFieldArray({
    name: "allocations",
    keyName: "key",
    control: form.control,
  });

  const { errors } = form.formState;

  return (
    <AllocationListWrapper>
      <SearchProjects onSelect={(id) => append({ id, amount: 0 })} />
      <Table>
        <Tbody>
          {fields.length ? (
            fields.map((project, i) => {
              const error = errors.allocations?.[i]?.amount?.message;
              return (
                <Tr key={project.key}>
                  <Td className={"w-full"}>
                    <ProjectAvatarWithName id={project.id} />
                    {error ? (
                      <div className="text-xs text-error-600">{error}</div>
                    ) : null}
                  </Td>

                  <Td>
                    <AllocationInput
                      name={`allocations.${i}.amount`}
                      onBlur={() => onSave?.(form.getValues())}
                    />
                  </Td>
                  <Td>
                    <IconButton
                      tabIndex={-1}
                      type="button"
                      variant="outline"
                      icon={Trash}
                      onClick={() => {
                        remove(i);
                        onSave?.(form.getValues());
                      }}
                    />
                  </Td>
                </Tr>
              );
            })
          ) : (
            <Tr>
              <Td
                colSpan={3}
                className="flex flex-1 items-center justify-center py-4"
              >
                <div className=" max-w-[360px] space-y-4">
                  <h3 className="text-center text-lg font-bold">
                    List is empty
                  </h3>
                  <p className="text-center text-sm text-gray-700">
                    Search projects to add them to the list.
                  </p>
                </div>
              </Td>
            </Tr>
          )}
        </Tbody>
      </Table>
      <button type="submit" className="hidden" />
    </AllocationListWrapper>
  );
}

export const ProjectAvatarWithName = ({
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
      <Avatar size="sm" src={project?.profile?.profileImageUrl} />
      <div>
        <div className="whitespace-nowrap font-bold">
          {project?.displayName}
        </div>
        <div className="text-muted">{subtitle}</div>
      </div>
    </Link>
  );
};
