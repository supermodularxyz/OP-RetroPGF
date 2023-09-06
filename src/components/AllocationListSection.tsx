import { type Allocation } from "~/hooks/useBallot";
import { AllocationListWrapper, ProjectAvatarWithName } from "./AllocationList";
import { Table, Tbody, Tr, Td } from "./ui/Table";
import { formatNumber } from "~/utils/formatNumber";

type Props = { allocations: Allocation[] };

export const AllocationListSection: React.FC<Props> = ({
  allocations,
}: Props) => (
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
