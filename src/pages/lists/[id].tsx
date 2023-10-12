import { useRouter } from "next/router";
import { Layout } from "~/components/Layout";
import { useList } from "~/hooks/useLists";

import { ListDetails } from "~/components/ListDetails";

export default function ViewListPage() {
  const router = useRouter();
  const id = router.query.id as string;
  const { data: list, isLoading } = useList(id);

  return (
    <Layout sidebar="left">
      <ListDetails list={list!} isLoading={isLoading} />
    </Layout>
  );
}
