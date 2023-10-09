import { Layout } from "~/components/Layout";
import { BallotConfirmation } from "~/components/BallotConfirmation";
import { useBallot } from "~/hooks/useBallot";

export default function BallotConfirmationPage() {
  const { data: ballot } = useBallot();

  if (!ballot) return null;

  return (
    <Layout>
      <BallotConfirmation allocations={ballot?.votes} />
    </Layout>
  );
}
