import { useMemo } from "react";
import projects from "~/data/projects.json";
import { type Project } from "./useProjects";

export type ImpactCategory =
  | "OP_STACK"
  | "COLLECTIVE_GOVERNANCE"
  | "DEVELOPER_ECOSYSTEM"
  | "END_USER_EXPERIENCE_AND_ADOPTION";

export type ListsOnlyTags = "ALL" | "LIKED";

export const categoryMap = {
  COLLECTIVE_GOVERNANCE: "collectiveGovernance",
  DEVELOPER_ECOSYSTEM: "developerEcosystem",
  END_USER_EXPERIENCE_AND_ADOPTION: "endUserExperienceAndAdoption",
  OP_STACK: "opStack",
};

export const impactCategoryLabels = {
  COLLECTIVE_GOVERNANCE: "Collective Governance",
  OP_STACK: "OP Stack",
  DEVELOPER_ECOSYSTEM: "Developer Ecosystem",
  END_USER_EXPERIENCE_AND_ADOPTION: "End user UX",
};

export const impactCategoryDescriptions = {
  COLLECTIVE_GOVERNANCE:
    "Work that increased the efficiency, security, resilience and awareness of the OP Stack",
  OP_STACK:
    "Work that increased the efficiency, security, resilience and awareness of the OP Stack",
  DEVELOPER_ECOSYSTEM:
    "Work that increased the efficiency, security, resilience and awareness of the OP Stack",
  END_USER_EXPERIENCE_AND_ADOPTION:
    "Work that increased the efficiency, security, resilience and awareness of the OP Stack",
};

export const useCategories = () => {
  return useMemo(() => {
    // Set each category to 0 - { OP_STACK: 0, COLLECTIVE_GOVERNANCE: 0, ...}
    const initialState = Object.keys(impactCategoryLabels).reduce(
      (a, x) => ({ ...a, [x]: 0 }),
      {}
    );
    return (projects as Project[]).reduce((acc, x) => {
      x.impactCategory?.forEach((category) => (acc[category] += 1));
      return acc;
    }, initialState as { [key in ImpactCategory]: number });
  }, []);
};
