import { useRouter } from "next/router";
import { Layout } from "~/components/Layout";

export default function ViewListPage() {
  const router = useRouter();

  return <Layout>View List {router.query.id}</Layout>;
}
