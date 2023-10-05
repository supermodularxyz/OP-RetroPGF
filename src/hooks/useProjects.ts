import { initialFilter, type Filter } from "./useFilter";
import { type ImpactCategory } from "./useCategories";
import { useQuery } from "@tanstack/react-query";
import { useAllLists } from "./useLists";
import axios from "axios";

export const PAGE_SIZE = 12;

export type Project = {
  id: string;
  applicantType: "PROJECT" | "INDIVIDUAL";
  displayName: string;
  owner: string;
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
  profile?: {
    id: string;
    name: string;
    profileImageUrl: string;
    bannerImageUrl: string;
    websiteUrl: string;
    bio: string;
  };
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

const backendUrl = process.env.NEXT_PUBLIC_BACKEND_API!;

const PROJECT_FRAGMENT = `
displayName
payoutAddress {
  address
}
websiteUrl
applicantType
bio
contributionDescription
contributionLinks {
  description
  type
  url
}
fundingSources {
  currency
  amount
  description
  type
}
id
impactCategory
impactDescription
impactMetrics {
  description
  number
  url
}
profile {
  id
  name
  profileImageUrl
  bannerImageUrl
  websiteUrl
  bio
}
`;
const ProjectQuery = `
  query Project($id: ID!) {
    retroPGF {
      project(id: $id) {
        ${PROJECT_FRAGMENT}
      }
    }
  }
`;
const ProjectsQuery = `
  query Projects($first: Int!, $skip: Int!, $orderBy: ProjectOrder!, $category: [ProjectCategory!], $search: String, $seed: String) {
    retroPGF {
      projects(first: $first, skip: $skip, orderBy: $orderBy, category: $category, search: $search, seed: $seed) {
        pageInfo {
          hasNextPage
          hasPreviousPage
          startCursor
          endCursor
        }
        edges {
          cursor
          node {
            ${PROJECT_FRAGMENT}
          }
        }
      }
      projectsAggregate {
        collectiveGovernance
        developerEcosystem
        opStack
        total
        endUserExperienceAndAdoption
      }
    }
  }
`;

const sortMap = {
  shuffle: "shuffle",
  asc: "alphabeticalAZ",
  desc: "alphabeticalZA",
  liked: "byIncludedInBallots",
};
export function useProjects(filter: Filter) {
  const {
    page = 1,
    sort = "shuffle",
    categories = [],
    search = "",
    seed,
  } = filter ?? initialFilter;

  return useQuery(
    ["projects", { page, sort, categories, search, seed }],
    () => {
      return axios
        .post<{
          data: {
            retroPGF: {
              projects: { edges: { node: Project }[] };
              projectsAggregate: {
                total: number;
                collectiveGovernance: number;
                developerEcosystem: number;
                endUserExperienceAndAdoption: number;
                opStack: number;
              };
            };
          };
        }>(`${backendUrl}/graphql`, {
          query: ProjectsQuery,
          variables: {
            first: PAGE_SIZE,
            skip: (page - 1) * PAGE_SIZE,
            orderBy: sortMap[sort as keyof typeof sortMap] ?? sort,
            search,
            seed,
            category: categories.length ? categories : undefined,
          },
        })
        .then((r) => {
          const { projects, projectsAggregate } = r.data.data.retroPGF;

          const data = projects.edges.map((edge) => edge.node);

          const { total } = projectsAggregate;
          const pages = Math.ceil(total / PAGE_SIZE);

          return { data, pages };
        })
        .catch((err) => {
          console.log("err", err);
          return { data: [], pages: 1 };
        });
    }
  );
}

export function useProject(id: string) {
  return useQuery(
    ["projects", id],
    async () =>
      axios
        .post<{ data: { retroPGF: { project: Project } } }>(
          `${backendUrl}/graphql`,
          {
            query: ProjectQuery,
            variables: {
              id: id.split("|")[1],
            },
          }
        )
        .then((r) => r.data.data.retroPGF.project ?? null),
    { enabled: Boolean(id) }
  );
}

export function useListsForProject(id: string) {
  const { data: lists, isLoading } = useAllLists();
  return useQuery(
    ["projects", id, "lists"],
    () => lists?.filter((list) => list.projects.find((p) => p.id === id)),
    { enabled: Boolean(id && !isLoading) }
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
        ? categories.every((c) => item.impactCategory?.includes(c))
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
