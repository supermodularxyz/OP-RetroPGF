import { type z } from "zod";
import { Button, IconButton } from "~/components/ui/Button";
import {
  AddBallot,
  Adjustment,
  ArrowRotateLeft,
  CircleCheck,
} from "~/components/icons";
import { Dialog } from "./ui/Dialog";
import {
  useState,
  createElement,
  type FunctionComponent,
  type ComponentPropsWithoutRef,
} from "react";
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

import { useAddToBallot } from "~/hooks/useBallot";
import { Spinner } from "./ui/Spinner";
import Link from "next/link";

type FormAllocations = z.infer<typeof AllocationsSchema>["allocations"];

const FeedbackDialog = ({
  icon,
  variant,
  children,
}: ComponentPropsWithoutRef<"div"> & {
  variant: "success" | "info";
  icon: FunctionComponent<{ className: string }>;
}) => {
  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <Banner variant={variant}>
        {createElement(icon, { className: "w-8 h-8" })}
      </Banner>
      {children}
    </div>
  );
};

export const ListEditDistribution = ({ list }: { list: List }) => {
  const { address } = useAccount();
  const [isOpen, setOpen] = useState(false);
  const add = useAddToBallot();

  // TODO: list will have a listContent array with project id and amount
  const allocations = list.projects
    .slice(0, 5)
    .map((l) => ({ ...l, amount: 20_000 }));

  function handleAddToBallot({
    allocations,
  }: {
    allocations: FormAllocations;
  }) {
    add.mutate(allocations);
  }

  const showDialogTitle = !(add.isLoading || add.isSuccess);
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
        title={showDialogTitle ? `Edit distribution` : null}
      >
        {add.isSuccess ? (
          <FeedbackDialog variant="success" icon={CircleCheck}>
            <div className="font-semibold">List added to ballot</div>
            <Button as={Link} href={"/ballot"}>
              View ballot
            </Button>
          </FeedbackDialog>
        ) : add.isLoading ? (
          <FeedbackDialog variant="info" icon={Spinner}>
            <div className="font-semibold">Adding list to ballot</div>
          </FeedbackDialog>
        ) : (
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
        )}
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

  const exceeds = current + sum - OP_TO_ALLOCATE;

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
    <IconButton
      className="text-gray-400"
      icon={ArrowRotateLeft}
      variant="ghost"
      onClick={() => form.reset()}
    >
      Reset distribution
    </IconButton>
  );
};
