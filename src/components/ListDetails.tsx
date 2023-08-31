import { type List } from "~/hooks/useLists";
import { AvatarWithName } from "./Lists";
import { Button, IconButton } from "~/components/ui/Button";
import {
  ExternalLinkOutline,
  Like,
  Liked,
  MoreHorizontal,
  Document,
  AddBallot,
  Adjustment,
  Share,
  Flag,
} from "~/components/icons";
import { tv } from "tailwind-variants";
import { createComponent } from "~/components/ui";
import { Avatar } from "./ui/Avatar";
import { useAccount } from "wagmi";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import Link from "next/link";
import { AllocationList } from "./AllocationList";

export const ListDetails = ({ list }: { list: List }) => {
  const isLiked = false;
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
              <AvatarWithName name={list.creatorName} />
            </div>
            <div className="flex h-fit gap-3">
              <BorderedIcon>
                <div className="flex items-center gap-1">
                  <span className="text-xs text-neutral-600">
                    {list.likesNumber}
                  </span>
                  <IconButton
                    icon={isLiked ? Liked : Like}
                    variant={"ghost"}
                    className="!m-0 !p-0 text-neutral-600"
                  />
                </div>
              </BorderedIcon>

              <DropdownMenu.Root>
                <DropdownMenu.Trigger asChild>
                  <BorderedIcon>
                    <div className="flex items-center">
                      <IconButton
                        className="text-neutral-500"
                        icon={MoreHorizontal}
                        variant={"ghost"}
                      />
                    </div>
                  </BorderedIcon>
                </DropdownMenu.Trigger>

                <DropdownMenu.Portal>
                  <DropdownMenu.Content
                    className="w-[200px] rounded-2xl border border-gray-300 bg-white p-2"
                    sideOffset={5}
                  >
                    <DropdownMenu.Group>
                      <div className="flex items-center gap-3 px-2 py-3">
                        <Share className="text-neutral-600" />
                        <span className="text-neutral-600">Share</span>
                      </div>
                      <div className="flex items-center gap-3 px-2 py-3">
                        <Flag className="text-neutral-600" />
                        <span className="text-neutral-600">Report</span>
                      </div>
                    </DropdownMenu.Group>
                  </DropdownMenu.Content>
                </DropdownMenu.Portal>
              </DropdownMenu.Root>
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
              <AllocationList
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

const BorderedIcon = createComponent(
  "div",
  tv({ base: "border border-neutral-300 rounded-xl py-1 px-2 " })
);

const Card = createComponent(
  "div",
  tv({ base: "border border-neutral-300 rounded-2xl p-6" })
);