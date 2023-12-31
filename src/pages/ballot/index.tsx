import Link from "next/link";
import { useState } from "react";
import { useFormContext } from "react-hook-form";
import { type z } from "zod";
import { AllocationForm } from "~/components/AllocationList";
import { Layout } from "~/components/Layout";
import { SortByDropdown } from "~/components/SortByDropdown";
import { Button } from "~/components/ui/Button";
import { Form, SearchInput } from "~/components/ui/Form";
import { Spinner } from "~/components/ui/Spinner";
import { Allocation, useBallot } from "~/hooks/useBallot";
import { sumBallot, useSaveBallot } from "~/hooks/useBallot";
import { type Filter } from "~/hooks/useFilter";
import { AllocationsSchema } from "~/schemas/allocation";
import { formatNumber } from "~/utils/formatNumber";

const options = [
  "shuffle",
  "asc",
  "desc",
  "ascOP",
  "descOP",
] as Filter["sort"][];

export default function BallotPage() {
  const { data: ballot, isLoading } = useBallot();

  const allocations = ballot?.votes ?? [];

  return (
    <Layout sidebar="right" requireAuth>
      {isLoading ? null : (
        <Form
          schema={AllocationsSchema}
          defaultValues={{ allocations }}
          onSubmit={console.log}
        >
          <h1 className="mb-2 text-2xl font-bold">Review your ballot</h1>
          <p className="mb-6">
            Once you have reviewed your OP allocation, you can submit your
            ballot.
          </p>

          <BallotAllocationForm allocations={allocations} />
        </Form>
      )}
      <div className="py-8" />
    </Layout>
  );
}

function BallotAllocationForm({ allocations }: { allocations: Allocation[] }) {
  const form = useFormContext();

  const [search, setSearch] = useState("");
  const [sort, setSort] = useState(options[4]);

  const save = useSaveBallot();

  function handleSaveBallot({
    allocations,
  }: {
    allocations: z.infer<typeof AllocationsSchema>["allocations"];
  }) {
    form.reset({ allocations });
    save.mutate(allocations);
  }

  const filter = { search, sort };

  return (
    <div className="relative rounded-2xl border border-gray-300">
      <div className="p-8">
        <div className="mb-4 flex gap-3">
          <SearchInput
            placeholder="Search projects..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <SortByDropdown value={sort} onChange={setSort} options={options} />
        </div>
        <div className="relative flex max-h-[500px] min-h-[360px] flex-col overflow-auto">
          {allocations.length ? (
            <AllocationForm filter={filter} onSave={handleSaveBallot} />
          ) : (
            <EmptyBallot />
          )}
        </div>
      </div>

      <div className="flex h-16 items-center justify-between rounded-b-2xl border-t border-gray-300 bg-[#EDF4FC] px-8 py-4 text-lg font-semibold">
        <div>Total OP in ballot</div>
        <div className="flex items-center gap-2">
          {save.isLoading && <Spinner />}
          <TotalOP />
        </div>
      </div>
    </div>
  );
}

const EmptyBallot = () => (
  <div className="flex flex-1 items-center justify-center">
    <div className=" max-w-[360px] space-y-4">
      <h3 className="text-center text-lg font-bold">Your ballot is empty</h3>
      <p className="text-center text-sm text-gray-700">
        Your ballot currently doesn&apos;t have any projects added. Browse
        through the available projects and lists.
      </p>
      <div className="flex items-center justify-center gap-3">
        <Button variant="outline" as={Link} href={"/projects"}>
          View projects
        </Button>
        <div className="text-gray-700">or</div>
        <Button variant="outline" as={Link} href={"/lists"}>
          View lists
        </Button>
      </div>
    </div>
  </div>
);

const TotalOP = () => {
  const form = useFormContext();

  const allocations = (form.watch("allocations") ?? []) as z.infer<
    typeof AllocationsSchema
  >["allocations"];

  const sum = sumBallot(allocations);

  return <div>{formatNumber(sum)} OP</div>;
};
