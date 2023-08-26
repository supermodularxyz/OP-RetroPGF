import { useMemo } from "react";
import { projects } from "~/data/mock";

export type ImpactCategory =
  | "OP_STACK"
  | "COLLECTIVE_GOVERNANCE"
  | "DEVELOPER_ECOSYSTEM"
  | "END_USER_EXPERIENCE_AND_ADOPTION";

export type ListsOnlyTags = "ALL" | "LIKED";

export const impactCategoryLabels = {
  COLLECTIVE_GOVERNANCE: "Collective Governance",
  OP_STACK: "OP Stack",
  DEVELOPER_ECOSYSTEM: "Developer Ecosystem",
  END_USER_EXPERIENCE_AND_ADOPTION: "End user UX",
};

export const useCategories = (type: "projects" | "lists") => {
  return useMemo(() => {
    // Set each category to 0 - { OP_STACK: 0, COLLECTIVE_GOVERNANCE: 0, ...}
    const initialState = Object.keys(impactCategoryLabels).reduce(
      (a, x) => ({ ...a, [x]: 0 }),
      {}
    );
    return projects.reduce((acc, x) => {
      x.impactCategory.forEach((category) => (acc[category] += 1));
      return acc;
    }, initialState as { [key in ImpactCategory]: number });
  }, [projects]);
};
