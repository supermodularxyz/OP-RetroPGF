import { useMemo } from "react";

export type ImpactCategory =
  | "OP_STACK"
  | "COLLECTIVE_GOVERNANCE"
  | "DEVELOPER_ECOSYSTEM"
  | "END_USER_EXPERIENCE_AND_ADOPTION";

export type ListsOnlyTags = "ALL" | "LIKED";

export const impactCategoryLabels = (type: 'projects' | 'lists') => {
  const impactTags = {
    COLLECTIVE_GOVERNANCE: "Collective Governance",
    OP_STACK: "OP Stack",
    DEVELOPER_ECOSYSTEM: "Developer Ecosystem",
    END_USER_EXPERIENCE_AND_ADOPTION: "End user UX",
  };
  return type == "projects" ? impactTags : { ALL: "All", LIKED: "Liked", ...impactTags};
};

export const useCategories = <T extends { impactCategory: ImpactCategory[] }[]>(
  items: T,
  type: "projects" | "lists"
) => {
  return useMemo(() => {
    // Set each category to 0 - { OP_STACK: 0, COLLECTIVE_GOVERNANCE: 0, ...}
    const initialState = Object.keys(impactCategoryLabels(type)).reduce(
      (a, x) => ({ ...a, [x]: 0 }),
      {}
    );
    return items.reduce((acc, x) => {
      
      x.impactCategory.forEach((category) => (acc[category] += 1));
      return acc;

    }, initialState as { [key in ImpactCategory]: number });
  }, [items]);
};
