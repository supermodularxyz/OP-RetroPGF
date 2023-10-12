import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { CategoriesQuery } from "~/graphql/queries";
import { Aggregate } from "~/graphql/utils";

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
} as const;

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

const backendUrl = process.env.NEXT_PUBLIC_BACKEND_API!;

export function useCategories() {
  return useQuery(["categories"], () => {
    return axios
      .post<{
        data: {
          retroPGF: { projectsAggregate: Aggregate };
        };
      }>(`${backendUrl}/graphql`, { query: CategoriesQuery })
      .then((r) => {
        const { total, ...categories } = r.data.data.retroPGF.projectsAggregate;
        return categories ?? null;
      });
  });
}
