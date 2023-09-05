import { useState } from "react";
import Link from "next/link";
import { useAccount } from "wagmi";
import { type List } from "~/hooks/useLists";
import { Button, IconButton } from "~/components/ui/Button";
import {
  ExternalLinkOutline,
  Like,
  Liked,
  Document,
  AddBallot,
  Adjustment,
  Share,
  Flag,
} from "~/components/icons";
import { tv } from "tailwind-variants";
import { createComponent } from "~/components/ui";
import { Avatar } from "./ui/Avatar";
import { AllocationListSection } from "./AllocationListSection";
import { CopyButton } from "./CopyButton";
import { MoreDropdown } from "./MoreDropdown";

export const ListDetails = ({ list }: { list: List }) => {
  // TODO: temporary like
  const [isLiked, setLiked] = useState(false);
  const allocatedOP = 0;
  const { address } = useAccount();
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
                  <div className="text-sm font-semibold">
                    {list.creatorName}
                  </div>
                  {/* TODO: should probably be address here  */}
                  <CopyButton value={list.creatorName} />
                </div>
              </div>
            </div>
            <div className="flex h-fit gap-3">
              <Button
                variant="outline"
                className="text-gray-600"
                onClick={() => setLiked(!isLiked)}
              >
                <span className="text-xs">{list.likesNumber}</span>
                {isLiked ? (
                  <Liked className="ml-2 h-4 w-4 text-primary-600" />
                ) : (
                  <Like className="ml-2 h-4 w-4" />
                )}
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
                <p className="font-bold">{allocatedOP} OP allocated</p>
              </div>
              <div className="mt-2 flex flex-col items-center gap-4 sm:mt-0 sm:flex-row">
                <IconButton
                  variant=""
                  icon={Adjustment}
                  className="w-full md:w-auto"
                  disabled={!address}
                >
                  Edit distribution
                </IconButton>
                <IconButton
                  variant="primary"
                  icon={AddBallot}
                  className="w-full md:w-auto"
                  disabled={!address}
                >
                  Add to ballot
                </IconButton>
              </div>
            </div>
            <div className="max-h-[480px] overflow-y-scroll">
              <AllocationListSection
                allocations={list.projects.map((p) => ({
                  ...p,
                  amount: 20_000,
                }))}
              />
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
