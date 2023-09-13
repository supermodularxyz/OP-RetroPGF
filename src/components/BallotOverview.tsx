import { tv } from "tailwind-variants";
import { createComponent } from "./ui";
import { Button } from "./ui/Button";
import { Divider } from "./ui/Divider";
import { Progress } from "./ui/Progress";
import { ExternalLink } from "./ui/Link";
import type { PropsWithChildren, ReactNode } from "react";
import { ballotToArray, sumBallot, useBallot } from "~/hooks/useBallot";
import Link from "next/link";
import { formatNumber } from "~/utils/formatNumber";
import { useRouter } from "next/router";

export const OP_TO_ALLOCATE = 30_000_000;
export const BallotOverview = () => {
  const router = useRouter();

  const { data: ballot } = useBallot();

  const allocations = ballotToArray(ballot);
  const sum = sumBallot(allocations);

  const canSubmit = router.route === "/ballot" && allocations.length;
  return (
    <div className="space-y-6">
      <h3 className="text-sm font-semibold uppercase tracking-widest text-gray-700">
        Your ballot
      </h3>
      <BallotSection title="Voting ends in:">
        <div>
          <TimeSlice>3d</TimeSlice>:<TimeSlice>12h</TimeSlice>:
          <TimeSlice>30m</TimeSlice>:<TimeSlice>24s</TimeSlice>
        </div>
      </BallotSection>
      <BallotSection title="Projects added:">
        <div>
          <span className="text-gray-900">{allocations.length}</span>
          /200
        </div>
      </BallotSection>
      <BallotSection
        title={
          <div className="flex justify-between">
            OP allocated:
            <div className="text-gray-900">{formatNumber(sum)} OP</div>
          </div>
        }
      >
        <Progress value={sum} max={OP_TO_ALLOCATE} />
        <div className="flex justify-between text-xs">
          <div>Total</div>
          <div>{formatNumber(OP_TO_ALLOCATE)} OP</div>
        </div>
      </BallotSection>
      {canSubmit ? (
        <Button
          variant="primary"
          onClick={async () => {
            console.log("TODO: Submit ballot dialog");
            await router.push("/ballot/confirmation");
          }}
        >
          Submit ballot
        </Button>
      ) : allocations.length ? (
        <Button variant="outline" as={Link} href={"/ballot"}>
          View ballot
        </Button>
      ) : (
        <Button variant="primary" disabled>
          No projects added yet
        </Button>
      )}
      <Divider />
      <p className="text-gray-700">
        {canSubmit
          ? `If you don't allocate all 30m OP, the remainder will be distributed in proportion to all badgeholders' votes.`
          : `As a badgeholder you are tasked with upholding the principle of “impact
        = profit” - the idea that positive impact to the Collective should be
        rewarded with profit to the individual.`}
      </p>
      <div>
        <ExternalLink href="/" target="_blank">
          Badgeholder Manual
        </ExternalLink>
      </div>
    </div>
  );
};

const BallotSection = ({
  title,
  children,
}: { title: string | ReactNode } & PropsWithChildren) => (
  <div className="space-y-1">
    <h4 className="text-sm font-semibold text-gray-500">{title}</h4>
    <div className="space-y-1 text-lg font-semibold text-gray-500">
      {children}
    </div>
  </div>
);

const TimeSlice = createComponent("span", tv({ base: "text-gray-900" }));
