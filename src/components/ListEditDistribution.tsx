import { Button, IconButton } from "~/components/ui/Button";
import { AddBallot, Adjustment } from "~/components/icons";
import { Dialog } from "./ui/Dialog";
import { useState } from "react";
import { Form } from "./ui/Form";
import { type List } from "~/hooks/useLists";
import { useAccount } from "wagmi";
import { AllocationForm } from "./AllocationList";
import { AllocationsSchema } from "~/schemas/allocation";
import { useFormContext } from "react-hook-form";
import { Banner } from "./ui/Banner";
import { formatNumber } from "~/utils/formatNumber";
import { ballotToArray, sumBallot, useBallot } from "~/hooks/useBallot";
import { OP_TO_ALLOCATE } from "./BallotOverview";
import { type z } from "zod";
import { useAddToBallot } from "~/hooks/useBallot";

type FormAllocations = z.infer<typeof AllocationsSchema>["allocations"];

export const ListEditDistribution = ({ list }: { list: List }) => {
  const { address } = useAccount();
  const [isOpen, setOpen] = useState(false);
  const add = useAddToBallot();

  const allocations = list.projects
    .slice(0, 5)
    .map((l) => ({ ...l, amount: 20_000 }));

  function handleAddToBallot({
    allocations,
  }: {
    allocations: FormAllocations;
  }) {
    console.log("Add to ballot", allocations);

    // TODO: how do we get the project details here?
    // Or perhaps better to fetch that in another way. Challenge is to make sorting work.
    // add.mutate(allocations);
  }
  return (
    <div>
      <IconButton
        variant="outline"
        onClick={() => setOpen(true)}
        icon={Adjustment}
        className="w-full md:w-auto"
        disabled={!address}
      >
        Edit distribution
      </IconButton>
      <Dialog
        isOpen={isOpen}
        onOpenChange={setOpen}
        title={`Edit distribution`}
      >
        <Form
          schema={AllocationsSchema}
          defaultValues={{ allocations }}
          onSubmit={handleAddToBallot}
        >
          <ResetDistribution />
          <AllocationForm filter={{}} />
          <TotalOPBanner />
          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              className={"w-full"}
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <IconButton
              type="submit"
              variant="primary"
              className={"w-full"}
              icon={AddBallot}
            >
              Add to ballot
            </IconButton>
          </div>
        </Form>
      </Dialog>
    </div>
  );
};
const TotalOPBanner = () => {
  const form = useFormContext();

  // Load existing ballot
  const { data: ballot } = useBallot();
  const sum = sumBallot(ballotToArray(ballot));

  const allocations = (form.watch("allocations") ?? []) as FormAllocations;

  const current = sumBallot(allocations);
  console.log("allocations", allocations, current);

  const exceeds = current + sum - OP_TO_ALLOCATE;

  console.log({ exceeds });

  const isExceeding = exceeds > 0;
  return (
    <Banner
      variant={isExceeding ? "warning" : "info"}
      className={"mb-6 flex justify-between font-semibold"}
    >
      <div>
        {isExceeding ? `Total exceeds by ${formatNumber(exceeds)} OP` : "Total"}
      </div>
      <div>{formatNumber(current + sum)} OP</div>
    </Banner>
  );
};

const ResetDistribution = () => {
  const form = useFormContext();
  return (
    <Button variant="ghost" onClick={() => form.reset()}>
      Reset distribution
    </Button>
  );
};
