import { useRouter } from "next/router";
import { Layout } from "~/components/Layout";

export default function ViewProjectPage() {
  const router = useRouter();

  return <Layout>View Project {router.query.id}</Layout>;
}
