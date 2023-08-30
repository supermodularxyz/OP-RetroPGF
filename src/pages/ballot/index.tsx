import { useState } from "react";
import { useFormContext } from "react-hook-form";
import { type z } from "zod";
import { AllocationForm, AllocationSchema } from "~/components/AllocationList";
import { Layout } from "~/components/Layout";
import { SortBy } from "~/components/SortBy";
import { Form, SearchInput } from "~/components/ui/Form";
import { arrayToBallot } from "~/hooks/useBallot";
import {
  ballotToArray,
  sumBallot,
  useBallot,
  useSaveBallot,
} from "~/hooks/useBallot";
import { type Filter } from "~/hooks/useFilter";

const options = [
  "shuffle",
  "asc",
  "desc",
  "ascOP",
  "descOP",
] as Filter["sort"][];

export default function BallotPage() {
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState(options[4]);

  const save = useSaveBallot();
  const { data: ballot, isLoading } = useBallot();
  const allocations = ballotToArray(ballot);

  const filter = { search, sort };

  function handleSaveBallot({
    allocations,
  }: {
    allocations: z.infer<typeof AllocationSchema>["allocations"];
  }) {
    save.mutate(arrayToBallot(allocations));
  }
  return (
    <Layout sidebar="right">
      {isLoading ? null : (
        <Form
          schema={AllocationSchema}
          defaultValues={{ allocations }}
          onSubmit={handleSaveBallot}
        >
          <h1 className="mb-2 text-2xl font-bold">Review your ballot</h1>
          <p className="mb-6">
            Once you have reviewed your OP allocation, you can submit your
            ballot.
          </p>
          <div className="rounded-2xl border border-gray-300">
            <div className="p-8">
              <div className="mb-4 flex gap-3">
                <SearchInput
                  placeholder="Search projects..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
                <SortBy value={sort} onChange={setSort} options={options} />
              </div>
              <AllocationForm filter={filter} onSave={handleSaveBallot} />
            </div>
            <div className="flex justify-between rounded-b-2xl border-t border-gray-300 bg-[#EDF4FC] px-8 py-4 text-lg font-semibold">
              <div>Total OP in ballot</div>
              <TotalOP />
            </div>
          </div>
        </Form>
      )}
      <div className="py-8" />
    </Layout>
  );
}

const TotalOP = () => {
  const form = useFormContext();

  const allocations = (form.watch("allocations") ?? []) as z.infer<
    typeof AllocationSchema
  >["allocations"];

  const sum = sumBallot(allocations);

  return <div>{sum} OP</div>;
};
