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

export const fundingSourcesLabels = {
  RETROPGF_1: "RetroPGF 1",
  RETROPGF_2: "RetroPGF 2",
  GOVERNANCE_FUND: "Governance Fund",
  PARTNER_FUND: "Partner Fund",
  REVENUE: "Revenue",
  OTHER: "Other",
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
        setTimeout(
          () =>
            resolve(paginate(sortAndFilter(projects, filter), filter?.page)),
          500
        );
      })
  );
}

export function useProject(id: string) {
  return useQuery(
    ["projects", id],
    async () => projects.find((p) => p.id === id),
    { enabled: Boolean(id) }
  );
}

export function sortAndFilter<
  T extends {
    displayName: string;
    impactCategory: ImpactCategory[];
    amount?: number;
  }
>(collection: T[], filter: Filter) {
  const {
    sort = "shuffle",
    categories = [],
    search = "",
  } = filter ?? initialFilter;

  // Temporary sorting
  const sortFn = {
    shuffle: (arr: T[]) => arr,
    asc: (arr: T[]) =>
      arr.sort((a: T, b: T) => a.displayName?.localeCompare(b.displayName)),
    desc: (arr: T[]) =>
      arr.sort((a: T, b: T) => b.displayName?.localeCompare(a.displayName)),
    ascOP: (arr: T[]) =>
      arr.sort((a: T, b: T) => ((a.amount ?? 0) > (b.amount ?? 0) ? 1 : -1)),
    descOP: (arr: T[]) =>
      arr.sort((a: T, b: T) => ((a.amount ?? 0) > (b.amount ?? 0) ? -1 : 1)),
    // TODO: sort by likes
    liked: (arr: T[]) => arr,
  }[sort];

  return sortFn([...collection])
    .filter((item) =>
      categories.length
        ? categories.every((c) => item.impactCategory.includes(c))
        : item
    )
    .filter((p) => p.displayName?.toLowerCase().includes(search.toLowerCase()));
}

export function paginate<T>(collection: T[], page = 1) {
  const pageSize = 6;
  const start = (page - 1) * pageSize;
  const end = start + pageSize;

  const pages = Math.ceil(collection.length / pageSize);

  return {
    data: collection.slice(start, end),
    pages,
  };
}
