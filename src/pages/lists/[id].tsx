import { useRouter } from "next/router";
import { Layout } from "~/components/Layout";
import { useList } from "~/hooks/useLists";

import { ListDetails } from "~/components/ListDetails";

export default function ViewListPage() {
  const router = useRouter();
  const id = router.query.id as string;
  const { data: list } = useList(id);

  return <Layout>{!list ? 
    // TODO: add list not found/redirect to 404 after handling loading state
  <div></div> : <ListDetails list={list} />}</Layout>;
}
