import { useState } from "react";
import { useFormContext } from "react-hook-form";
import { z } from "zod";
import { AllocationForm, AllocationSchema } from "~/components/AllocationList";
import { Layout } from "~/components/Layout";
import { SortBy } from "~/components/SortBy";
import { Form, Input, SearchInput } from "~/components/ui/Form";
import { projects } from "~/data/mock";
import { type Filter } from "~/hooks/useFilter";

const allocations = projects
  .slice(0, 5)
  .map((p, i) => ({ ...p, amount: 1500 + i * 257 }));

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

  const filter = { search, sort };

  return (
    <Layout>
      <Form
        schema={AllocationSchema}
        defaultValues={{ allocations }}
        onSubmit={(values) => {
          console.log(values);
        }}
      >
        <h1 className="mb-2 text-2xl font-bold">Review your ballot</h1>
        <p className="mb-6">
          Once you have reviewed your OP allocation, you can submit your ballot.
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
            <AllocationForm filter={filter} />
          </div>
          <div className="flex justify-between rounded-b-2xl border-t border-gray-300 bg-[#EDF4FC] px-8 py-4 text-lg font-semibold">
            <div>Total OP in ballot</div>
            <TotalOP />
          </div>
        </div>
      </Form>
      <div className="py-8" />
    </Layout>
  );
}

const TotalOP = () => {
  const form = useFormContext();

  const allocations = (form.watch("allocations") ?? []) as z.infer<
    typeof AllocationSchema
  >["allocations"];

  const sum = allocations
    .reduce((sum, x) => sum + x.amount, 0)
    .toLocaleString("en-US", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    });

  return <div>{sum} OP</div>;
};
