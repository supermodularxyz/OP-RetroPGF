import { useQuery } from "wagmi";
import { initialFilter, type Filter } from "./useFilter";
import { projects } from "~/data/mock";
import { type ImpactCategory } from "./useCategories";

export type Project = {
  id: string;
  applicantType: "PROJECT" | "INDIVIDUAL";
  displayName: string;
  websiteUrl: string;
  bio: string;
  contributionDescription: string;
  contributionLinks: {
    type: "CONTRACT_ADDRESS" | "GITHUB_REPO" | "OTHER";
    url: string;
    description: string;
  }[];
  impactCategory: ImpactCategory[];
  impactDescription: string;
  impactMetrics: {
    description: string;
    number: number;
    url: string;
  }[];
  fundingSources: (
    | {
        type: "GOVERNANCE_FUND" | "PARTNER_FUND" | "RETROPGF_2";
        currency: "OP";
        amount: number;
        description?: string | undefined;
      }
    | {
        type: "RETROPGF_1" | "REVENUE" | "OTHER";
        currency: "USD";
        amount: number;
        description?: string | undefined;
      }
  )[];
  payoutAddress: string;
  understoodKYCRequirements: boolean;
  understoodFundClaimPeriod: boolean;
  certifiedNotDesignatedOrSanctionedOrBlocked: boolean;
  certifiedNotSponsoredByPoliticalFigureOrGovernmentEntity: boolean;
  certifiedNotBarredFromParticipating: boolean;
};


export function useProjects(filter: Filter) {
  const {
    page = 1,
    sort = "shuffle",
    categories = [],
  } = filter ?? initialFilter;
  const pageSize = 6;
  const start = (page - 1) * pageSize;
  const end = start + pageSize;

  // TODO: Call EAS attestations

  // Temporary sorting
  const sortFn = {
    shuffle: (arr: Project[]) => arr,
    asc: (arr: Project[]) =>
      arr.sort((a, b) => a.displayName.localeCompare(b.displayName)),
    desc: (arr: Project[]) =>
      arr.sort((a, b) => b.displayName.localeCompare(a.displayName)),
  }[sort];

  return useQuery(
    ["projects", { page, sort, categories }],
    () =>
      new Promise<{ data: Project[]; pages: number }>((resolve) => {
        const data = sortFn([...projects]).filter((project) =>
          categories.length
            ? categories.every((c) => project.impactCategory.includes(c))
            : project
        );

        const pages = Math.ceil(data.length / pageSize);
        return resolve({ data: data.slice(start, end), pages });
      })
  );
}


