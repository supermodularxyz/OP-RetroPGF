import { type PropsWithChildren, type ReactNode, useState } from "react";
import clsx from "clsx";
import Link from "next/link";
import { useRouter } from "next/router";

import { Banner } from "./ui/Banner";
import { Button } from "./ui/Button";
import { Divider } from "./ui/Divider";
import { Progress } from "./ui/Progress";
import { ExternalLink } from "./ui/Link";
import { sumBallot, useSubmitBallot, useBallot } from "~/hooks/useBallot";
import { formatNumber } from "~/utils/formatNumber";
import { Dialog } from "./ui/Dialog";
import { VotingEndsIn, useVotingTimeLeft } from "./VotingEndsIn";
import { useCategories } from "~/hooks/useCategories";

export const MAX_ALLOCATION_TOTAL = Number(
  process.env.NEXT_PUBLIC_MAX_ALLOCATION_TOTAL!
);
export const BallotOverview = () => {
  const router = useRouter();

  const { data: ballot } = useBallot();
  const { data: categoryCount } = useCategories();

  const allocations = ballot?.votes ?? [];
  const sum = sumBallot(allocations);

  const [, , , seconds] = useVotingTimeLeft();
  const canSubmit = router.route === "/ballot" && allocations.length;
  const votingHasEnded = seconds < 0;

  const projectCount = categoryCount?.projects?.total ?? "?";
  return (
    <div className="space-y-6">
      <h3 className="text-sm font-semibold uppercase tracking-widest text-gray-700">
        Your ballot
      </h3>
      <BallotSection title="Voting ends in:">
        <VotingEndsIn />
      </BallotSection>
      {!votingHasEnded ? (
        <>
          <BallotSection title="Projects added:">
            <div>
              <span className="text-gray-900">{allocations.length}</span>/
              {projectCount}
            </div>
          </BallotSection>
          <BallotSection
            title={
              <div className="flex justify-between">
                OP allocated:
                <div
                  className={clsx("text-gray-900", {
                    ["text-primary-500"]: sum > MAX_ALLOCATION_TOTAL,
                  })}
                >
                  {formatNumber(sum)} OP
                </div>
              </div>
            }
          >
            <Progress value={sum} max={MAX_ALLOCATION_TOTAL} />
            <div className="flex justify-between text-xs">
              <div>Total</div>
              <div>{formatNumber(MAX_ALLOCATION_TOTAL)} OP</div>
            </div>
          </BallotSection>
          {ballot?.publishedAt ? (
            <Button disabled>Submitted</Button>
          ) : canSubmit ? (
            <SubmitBallotButton disabled={sum > MAX_ALLOCATION_TOTAL} />
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
            <ExternalLink
              href="https://www.optimism.io/badgeholder-manual"
              target="_blank"
            >
              Badgeholder Manual
            </ExternalLink>
          </div>
        </>
      ) : null}
    </div>
  );
};

const SubmitBallotButton = ({ disabled = false }) => {
  const router = useRouter();
  const [isOpen, setOpen] = useState(false);

  const submit = useSubmitBallot({
    onSuccess: async () => {
      await router.push("/ballot/confirmation");
    },
  });

  const messages = {
    signing: {
      title: "Sign ballot",
      instructions:
        "Confirm the transactions in your wallet to submit your  ballot.",
    },
    submitting: {
      title: "Submit ballot",
      instructions:
        "Once you submit your ballot, you won’t be able to change it. If you are ready, go ahead and submit!",
    },
    error: {
      title: "Error subitting ballot",
      instructions: (
        <Banner variant="warning" title={(submit.error as Error)?.message}>
          There was an error submitting the ballot.
        </Banner>
      ),
    },
  };

  const { title, instructions } =
    messages[
      submit.isLoading ? "signing" : submit.error ? "error" : "submitting"
    ];

  return (
    <>
      <Button
        variant="primary"
        disabled={disabled}
        onClick={async () => setOpen(true)}
      >
        Submit ballot
      </Button>
      <Dialog size="sm" isOpen={isOpen} onOpenChange={setOpen} title={title}>
        <p className="pb-8">{instructions}</p>
        <div
          className={clsx("flex gap-2", {
            ["hidden"]: submit.isLoading,
          })}
        >
          <Button
            variant="outline"
            className="flex-1"
            onClick={() => setOpen(false)}
          >
            Back
          </Button>
          <Button
            className="flex-1"
            variant="primary"
            onClick={() => submit.mutate()}
          >
            Submit ballot
          </Button>
        </div>
      </Dialog>
    </>
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
