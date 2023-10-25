import { useState } from "react";
import { z } from "zod";
import clsx from "clsx";
import { useAccount } from "wagmi";
import { useFormContext } from "react-hook-form";

import { Button, IconButton } from "~/components/ui/Button";
import { AddBallot, Check } from "~/components/icons";
import { type Project } from "~/hooks/useProjects";
import {
  ballotContains,
  useAddToBallot,
  useBallot,
  useRemoveFromBallot,
} from "~/hooks/useBallot";
import { formatNumber } from "~/utils/formatNumber";
import { Dialog } from "./ui/Dialog";
import { AllocationInput } from "./AllocationInput";
import { Form } from "./ui/Form";
import { sumBallot } from "~/hooks/useBallot";
import { MAX_ALLOCATION_TOTAL } from "./BallotOverview";
import { track } from "@vercel/analytics/react";

export const MAX_ALLOCATION_PROJECT = Number(
  process.env.NEXT_PUBLIC_MAX_ALLOCATION_PROJECT!
);

export const ProjectAddToBallot = ({ project }: { project: Project }) => {
  const { address } = useAccount();
  const [isOpen, setOpen] = useState(false);
  const add = useAddToBallot();
  const remove = useRemoveFromBallot();
  const { data: ballot } = useBallot();

  const { id } = project ?? {};
  const inBallot = ballotContains(id, ballot);
  const allocations = ballot?.votes ?? [];
  const sum = sumBallot(allocations.filter((p) => p.projectId !== project?.id));

  return (
    <div>
      {inBallot ? (
        <IconButton
          onClick={() => setOpen(true)}
          variant="outline"
          icon={Check}
        >
          {formatNumber(inBallot.amount)} OP allocated
        </IconButton>
      ) : (
        <IconButton
          disabled={!address}
          onClick={() => {
            track("AddProjectToBallot");
            setOpen(true);
          }}
          variant="primary"
          icon={AddBallot}
          className="w-full md:w-auto"
        >
          Add to ballot
        </IconButton>
      )}
      <Dialog
        isOpen={isOpen}
        onOpenChange={setOpen}
        title={`Vote for ${project?.displayName}`}
      >
        <p className="pb-4 leading-relaxed">
          How much OP should this Project receive to fill the gap between the
          impact they generated for Optimism and the profit they received for
          generating this impact
        </p>
        <Form
          defaultValues={{ amount: inBallot?.amount }}
          schema={z.object({
            amount: z
              .number()
              .max(
                Math.min(MAX_ALLOCATION_PROJECT, MAX_ALLOCATION_TOTAL - sum)
              ),
          })}
          onSubmit={({ amount }) => {
            track("AddProjectToBallotConfirm");
            add.mutate([{ projectId: project.id, amount }]);
            setOpen(false);
          }}
        >
          <ProjectAllocation
            current={sum}
            inBallot={Boolean(inBallot)}
            onRemove={() => {
              remove.mutate(project.id);
              setOpen(false);
            }}
          />
        </Form>
      </Dialog>
    </div>
  );
};

const ProjectAllocation = ({
  current = 0,
  inBallot,
  onRemove,
}: {
  current: number;
  inBallot: boolean;
  onRemove: () => void;
}) => {
  const form = useFormContext();
  const formAmount = form.watch("amount") as string;
  const amount = formAmount
    ? parseFloat(String(formAmount).replace(/,/g, ""))
    : 0;
  const total = amount + current;

  const exceededProjectOP = amount > MAX_ALLOCATION_PROJECT;
  const exceededMaxOP = total > MAX_ALLOCATION_TOTAL;

  const isError = exceededProjectOP || exceededMaxOP;
  return (
    <div>
      <AllocationInput error={isError} name="amount" />
      <div className="flex justify-between gap-2 pt-2 text-sm">
        <div className="flex gap-2">
          <span className="text-gray-600">Total OP allocated:</span>
          <span
            className={clsx("font-semibold", {
              ["text-primary-500"]: exceededMaxOP,
            })}
          >
            {formatNumber(total)}
          </span>
        </div>
        <div className="flex gap-2">
          <span
            className={clsx("font-semibold", {
              ["text-primary-500"]: exceededProjectOP,
            })}
          >
            {formatNumber(amount)}
          </span>
          <span className="text-gray-600">/</span>
          <span className="text-gray-600">
            {formatNumber(MAX_ALLOCATION_PROJECT)}
          </span>
        </div>
      </div>
      <div className="space-y-2 pt-2">
        <Button
          variant="primary"
          type="submit"
          className="w-full"
          disabled={isError || !amount}
        >
          {inBallot ? "Update" : "Add"} votes
        </Button>
        {inBallot ? (
          <Button
            type="button"
            variant="ghost"
            className="w-full"
            onClick={onRemove}
          >
            Remove from ballot
          </Button>
        ) : null}
      </div>
    </div>
  );
};
