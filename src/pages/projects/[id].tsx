import { useRouter } from "next/router";
import { Layout } from "~/components/Layout";
import { useProject } from "~/hooks/useProjects";

import { ProjectDetails } from "~/components/ProjectDetails";

export default function ViewProjectPage() {
  const router = useRouter();
  const id = router.query.id as string;
  const { data: project } = useProject(id);

  return (
    <Layout sidebar="left">
      <ProjectDetails project={project!} />
    </Layout>
  );
}
