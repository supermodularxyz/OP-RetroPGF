import { useRouter } from "next/router";
import { Layout } from "~/components/Layout";
import { ListCreatedConfirmation } from "~/components/ListCreatedConfirmation";

export default function ListCreatedPage() {
  const router = useRouter();
  const { redirectTo = "#" } = router.query;
  return (
    <Layout>
      <ListCreatedConfirmation websiteUrl={redirectTo as string} />
    </Layout>
  );
}
