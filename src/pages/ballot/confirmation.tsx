import { Layout } from "~/components/Layout";
import { BallotConfirmation } from "~/components/BallotConfirmation";
import { ballotToArray, useBallot } from "~/hooks/useBallot";

export default function BallotConfirmationPage() {
  const { data: ballot, isLoading } = useBallot();
  const allocations = ballotToArray(ballot);

  return (
    <Layout>
      <BallotConfirmation allocations={allocations} />
    </Layout>
  );
}
