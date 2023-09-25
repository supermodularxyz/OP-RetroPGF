import { useRouter } from "next/router";
import { Layout } from "~/components/Layout";
import { ListCreatedConfirmation } from "~/components/ListCreatedConfirmation";

export default function ListCreatedPage() {
  const router = useRouter();
  const { website = "NOT_SET", redirectTo = "#" } = router.query;
  return (
    <Layout>
      <ListCreatedConfirmation
        website={website as string}
        websiteUrl={redirectTo as string}
      />
    </Layout>
  );
}
