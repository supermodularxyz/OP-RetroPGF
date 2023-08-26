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
    search = "",
  } = filter ?? initialFilter;

  // TODO: Call EAS attestations

  return useQuery(
    ["projects", { page, sort, categories, search }],
    () =>
      new Promise<{ data: Project[]; pages: number }>((resolve) => {
        // Fake server response time
        setTimeout(() => resolve(sortAndFilter(projects, filter)), 500);
      })
  );
}

export function sortAndFilter<
  T extends { displayName: string; impactCategory: ImpactCategory[] }
>(collection: T[], filter: Filter) {
  const {
    page = 1,
    sort = "shuffle",
    categories = [],
    search = "",
  } = filter ?? initialFilter;

  const pageSize = 6;
  const start = (page - 1) * pageSize;
  const end = start + pageSize;

  // Temporary sorting

  const sortFn = {
    shuffle: (arr: T[]) => arr,
    asc: (arr: T[]) =>
      arr.sort((a: T, b: T) => a.displayName.localeCompare(b.displayName)),
    desc: (arr: T[]) =>
      arr.sort((a: T, b: T) => b.displayName.localeCompare(a.displayName)),
  }[sort];

  const data = sortFn([...collection])
    .filter((item) =>
      categories.length
        ? categories.every((c) => item.impactCategory.includes(c))
        : item
    )
    .filter((p) => p.displayName.toLowerCase().includes(search.toLowerCase()));

  const pages = Math.ceil(data.length / pageSize);

  return {
    data: data.slice(start, end),
    pages,
  };
}
