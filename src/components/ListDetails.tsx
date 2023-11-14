import Link from "next/link";
import { Address, useAccount } from "wagmi";
import { tv } from "tailwind-variants";

import { useLikeList, type List } from "~/hooks/useLists";
import { useAvatar } from "~/hooks/useAvatar";
import { Button } from "~/components/ui/Button";
import { ExternalLinkOutline, Document } from "~/components/icons";
import { createComponent } from "~/components/ui";
import { Avatar } from "./ui/Avatar";
import { AllocationList } from "./AllocationList";
import { CopyButton } from "./CopyButton";
import { MoreDropdown } from "./MoreDropdown";
import { ListEditDistribution } from "./ListEditDistribution";
import { sumBallot } from "~/hooks/useBallot";
import { LikeCount } from "./Lists";
import { formatNumber } from "~/utils/formatNumber";
import { useRouter } from "next/router";
import { track } from "@vercel/analytics/react";

const reportUrl = process.env.NEXT_PUBLIC_REPORT_URL;
export const ListDetails = ({
  list,
  isLoading,
}: {
  list: List;
  isLoading?: boolean;
}) => {
  const router = useRouter();
  const { address } = useAccount();
  const like = useLikeList(list?.id);

  const listProjects =
    list?.listContent
      .map((p) => ({
        projectId: p.project.id,
        amount: p.OPAmount,
      }))
      .sort((a, b) => Number(b.amount) - Number(a.amount)) ?? [];

  const allocatedOP = sumBallot(listProjects);

  return (
    <>
      {!list && !isLoading ? (
        <h3>List not found</h3>
      ) : isLoading ? (
        <div>...</div>
      ) : (
        <div className="grid gap-10">
          <div className="flex justify-between gap-4 sm:items-center">
            <div>
              <h3 className="mb-2 text-2xl font-bold">{list?.listName}</h3>
              <UserDetails address={list?.author?.address} />
            </div>
            <div className="flex h-fit gap-3">
              <Button
                disabled={!address}
                variant={"outline"}
                type="button"
                className="text-gray-600"
                onClick={(e) => {
                  like.mutate(list.id);
                  track("LikeList", { id: list.id });
                }}
              >
                <LikeCount listId={list.id} />
              </Button>
            </div>
          </div>
          <div className="flex flex-col gap-3">
            <h3 className="text-lg font-bold">About</h3>
            <p className="whitespace-pre-wrap">{list.listDescription}</p>
          </div>
          <div className="flex flex-col gap-3">
            <h3 className="text-lg font-bold">Impact Evaluation</h3>
            <p className="whitespace-pre-wrap">
              {list.impactEvaluationDescription}
            </p>
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
          <Card className="border-0 p-0 md:border-2 md:p-6">
            <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
              <div className="flex items-center gap-2">
                <p className="font-bold">{listProjects.length} projects</p>
                <span>·</span>
                <p className="font-bold">
                  {formatNumber(allocatedOP)} OP allocated
                </p>
              </div>
              {!isLoading && (
                <ListEditDistribution list={list} listProjects={listProjects} />
              )}
            </div>
            <div className="max-h-[480px] overflow-y-scroll">
              {!isLoading && <AllocationList allocations={listProjects} />}
            </div>
          </Card>
        </div>
      )}
    </>
  );
};

function UserDetails({ address }: { address: Address }) {
  const { data } = useAvatar(address);

  return (
    <div className="flex items-center gap-1">
      <Avatar src={data?.avatar} size="xs" rounded="full" />
      <div className="flex items-center">
        <div className="text-sm font-semibold">{data?.name}</div>
        <CopyButton value={address} />
      </div>
    </div>
  );
}

const Card = createComponent(
  "div",
  tv({ base: "border border-neutral-300 rounded-2xl p-6" })
);
