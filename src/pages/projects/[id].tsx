import { useRouter } from "next/router";
import { Layout } from "~/components/Layout";
import { useProjectDetails } from "~/hooks/useProjects";

import { ProjectDetails } from "~/components/ProjectDetails";

export default function ViewProjectPage() {
  const router = useRouter();
  const id = router.query.id as string;
  const { data: project } = useProjectDetails(id);

  return (
    <Layout sidebar="left">
      <ProjectDetails project={project!} />
    </Layout>
  );
}
