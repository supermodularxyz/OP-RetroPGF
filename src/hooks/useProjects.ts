import { initialFilter, type Filter } from "./useFilter";
import { projects } from "~/data/mock";
import { type ImpactCategory } from "./useCategories";
import { useQuery } from "@tanstack/react-query";

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

export function useAllProjects() {
  return useQuery<Project[]>(["projects", "all"], () =>
    fetch("/api/projects").then((r) => r.json())
  );
}
export function useProjects(filter: Filter) {
  const {
    page = 1,
    sort = "shuffle",
    categories = [],
    search = "",
  } = filter ?? initialFilter;

  const projects = useAllProjects();
  return useQuery(
    ["projects", { page, sort, categories, search }],
    () => {
      return paginate(sortAndFilter(projects.data ?? [], filter), filter?.page);
    },
    { enabled: !projects.isLoading }
  );
}

export function useProject(id: string) {
  const projects = useAllProjects();
  return useQuery(
    ["projects", id],
    async () => projects.data?.find((p) => p.id === id),
    { enabled: Boolean(id) && !projects.isLoading }
  );
}

export function sortAndFilter<
  T extends {
    displayName: string;
    impactCategory: ImpactCategory[];
    amount?: number;
  }
>(collection: T[] = [], filter: Filter) {
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
    .filter((p) =>
      p.displayName
        ? p.displayName?.toLowerCase().includes(search.toLowerCase())
        : true
    );
}

export function paginate<T>(collection: T[], page = 1) {
  const pageSize = 12;
  const start = (page - 1) * pageSize;
  const end = start + pageSize;

  const pages = Math.ceil(collection.length / pageSize);

  return {
    data: collection.slice(start, end),
    pages,
  };
}
