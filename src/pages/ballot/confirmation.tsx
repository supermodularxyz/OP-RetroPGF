import { Layout } from "~/components/Layout";
import { BallotConfirmation } from "~/components/BallotConfirmation";
import { useBallot } from "~/hooks/useBallot";

export default function BallotConfirmationPage() {
  const { data: ballot } = useBallot();

  if (!ballot) return null;

  return (
    <Layout requireAuth>
      <BallotConfirmation
        allocations={ballot?.votes.sort((a, b) => +b.amount - +a.amount)}
      />
    </Layout>
  );
}
