import Link from "next/link";
import { useState } from "react";
import { useFormContext } from "react-hook-form";
import { type z } from "zod";
import { AllocationForm, AllocationSchema } from "~/components/AllocationList";
import { Layout } from "~/components/Layout";
import { SortBy } from "~/components/SortBy";
import { Button } from "~/components/ui/Button";
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
              <div className="relative flex min-h-[360px] flex-col">
                {allocations.length ? (
                  <AllocationForm filter={filter} onSave={handleSaveBallot} />
                ) : (
                  <EmptyBallot />
                )}
              </div>
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
    typeof AllocationSchema
  >["allocations"];

  const sum = sumBallot(allocations);

  return <div>{sum} OP</div>;
};
