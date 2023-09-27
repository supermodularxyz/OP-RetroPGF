import { Button, IconButton } from "~/components/ui/Button";
import { AddBallot, Check } from "~/components/icons";
import { type Project } from "~/hooks/useProjects";
import {
  Ballot,
  useAddToBallot,
  useBallot,
  useRemoveFromBallot,
} from "~/hooks/useBallot";
import { formatNumber } from "~/utils/formatNumber";
import { Dialog } from "./ui/Dialog";
import { useState } from "react";
import { AllocationInput } from "./AllocationInput";
import { Form } from "./ui/Form";
import { useFormContext } from "react-hook-form";
import { sumBallot } from "~/hooks/useBallot";
import { OP_TO_ALLOCATE } from "./BallotOverview";
import { z } from "zod";
import clsx from "clsx";

function ballotContains(id: string, ballot: Ballot) {
  return ballot?.votes.find((v) => v.projectId === id);
}

export const ProjectAddToBallot = ({ project }: { project: Project }) => {
  const [isOpen, setOpen] = useState(false);
  const add = useAddToBallot();
  const remove = useRemoveFromBallot();
  const { data: ballot } = useBallot();

  const { id } = project ?? {};
  const inBallot = ballotContains(id, ballot!);
  const allocations = ballot?.votes;
  const sum = sumBallot(
    allocations?.filter((p) => p.projectId !== project?.id)
  );

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
          onClick={() => setOpen(true)}
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
        <p className="pb-2">TEXT_DESCRIBING_VOTING_GUIDANCE</p>
        <Form
          defaultValues={{ amount: inBallot?.amount }}
          schema={z.object({ amount: z.number().max(OP_TO_ALLOCATE - sum) })}
          onSubmit={({ amount }) => {
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
  const isError = current + amount > OP_TO_ALLOCATE;

  return (
    <div>
      <AllocationInput error={isError} name="amount" />
      <div className="flex justify-end gap-2 pt-2 text-sm">
        <span
          className={clsx("font-semibold", { ["text-primary-500"]: isError })}
        >
          {formatNumber(current + amount)}
        </span>
        <span className="text-gray-600">/</span>
        <span className="text-gray-600">{formatNumber(OP_TO_ALLOCATE)}</span>
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
