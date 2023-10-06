import Link from "next/link";
import { useAccount } from "wagmi";
import { useLikeList, type List } from "~/hooks/useLists";
import { Button, IconButton } from "~/components/ui/Button";
import {
  ExternalLinkOutline,
  Document,
  AddBallot,
  Share,
  Flag,
} from "~/components/icons";
import { tv } from "tailwind-variants";
import { createComponent } from "~/components/ui";
import { Avatar } from "./ui/Avatar";
import { AllocationList } from "./AllocationList";
import { CopyButton } from "./CopyButton";
import { MoreDropdown } from "./MoreDropdown";
import { ListEditDistribution } from "./ListEditDistribution";
import { sumBallot } from "~/hooks/useBallot";
import { LikeCount } from "./Lists";
import { formatNumber } from "~/utils/formatNumber";
import { useProfile } from "~/hooks/useProfiles";

export const ListDetails = ({ list }: { list: List }) => {
  const { address } = useAccount();
  const like = useLikeList(list?.id);
  const { data: profile } = useProfile(list?.owner);

  const listProjects = list?.projects ?? [];
  const allocatedOP = sumBallot(listProjects);
  return (
    <>
      {!list ? (
        <h3>List not found</h3>
      ) : (
        <div className="grid gap-10">
          <div className="flex justify-between gap-4 sm:items-center">
            <div>
              <h3 className="mb-2 text-2xl font-bold">{list?.displayName}</h3>
              <div className="flex items-center gap-1">
                <Avatar size="xs" rounded="full" />
                <div className="flex items-center">
                  <div className="text-sm font-semibold">{profile?.name}</div>
                  <CopyButton value={list.owner} />
                </div>
              </div>
            </div>
            <div className="flex h-fit gap-3">
              <Button
                disabled={!address}
                variant={"outline"}
                type="button"
                className="text-gray-600"
                onClick={(e) => like.mutate(list.id)}
              >
                <LikeCount listId={list.id} />
              </Button>
              <MoreDropdown
                align="end"
                options={[
                  {
                    value: "share",
                    onClick: () => alert("share"),
                    label: "Share",
                    icon: Share,
                  },
                  {
                    value: "report",
                    onClick: () => alert("report"),
                    label: "Report",
                    icon: Flag,
                  },
                ]}
              />
            </div>
          </div>
          <div className="flex flex-col gap-3">
            <h3 className="text-lg font-bold">About</h3>
            <p>{list.bio}</p>
          </div>
          <div className="flex flex-col gap-3">
            <h3 className="text-lg font-bold">Impact Evaluation</h3>
            <p>{list.impactEvaluation}</p>
            <Button
              as={Link}
              href={list.impactEvaluationLink}
              target="_blank"
              className="group flex w-fit items-center gap-2 rounded-full border border-neutral-300 bg-transparent px-4 py-1"
            >
              <Document className="h-7 w-7 rounded-full p-1 text-neutral-600 transition-all group-hover:bg-neutral-200" />
              <span>Impact Evaluation</span>
              <ExternalLinkOutline className="text-neutral-600" />
            </Button>
          </div>
          <Card>
            <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
              <div className="flex items-center gap-2">
                <p className="font-bold">
                  {list.projects?.length || 0} projects{" "}
                </p>
                <span>·</span>
                <p className="font-bold">
                  {formatNumber(allocatedOP)} OP allocated
                </p>
              </div>
              <ListEditDistribution list={list} listProjects={listProjects} />
            </div>
            <div className="max-h-[480px] overflow-y-scroll">
              <AllocationList allocations={listProjects} />
            </div>
          </Card>
        </div>
      )}
    </>
  );
};

const Card = createComponent(
  "div",
  tv({ base: "border border-neutral-300 rounded-2xl p-6" })
);
