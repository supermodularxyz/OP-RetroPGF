import { initialFilter, type Filter } from "./useFilter";
import { type ImpactCategory } from "./useCategories";
import { useQuery } from "@tanstack/react-query";
import { useAllLists } from "./useLists";
import axios from "axios";

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
payoutAddress
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
}`;
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
  query Projects($first: Int!,  $orderBy: ProjectOrder!, $search: String, $seed: String) {
    retroPGF {
      projects(first: $first, orderBy: $orderBy, search: $search, seed: $seed) {
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
export function useProjects(filter: Filter) {
  const {
    page = 1,
    sort = "shuffle",
    categories = [],
    search = "",
  } = filter ?? initialFilter;

  return useQuery(["projects", { page, sort, categories, search }], () => {
    return axios
      .post<{
        data: {
          retroPGF: {
            projects: {
              edges: {
                node: {
                  id: string;
                };
              }[];
            };
          };
        };
      }>(`${backendUrl}/graphql`, {
        query: ProjectsQuery,
        variables: {
          first: 10,
          orderBy: "alphabeticalAZ",
          search: "",
          category: null,
        },
      })
      .then((r) => {
        const data = r.data.data.retroPGF.projects.edges.map(
          (edge) => edge.node
        );
        return {
          data,
          pages: 10,
        };
      })
      .catch((err) => {
        console.log("err", err);
        return [];
      });
    // return paginate(sortAndFilter(projects.data ?? [], filter), filter?.page);
  });
}

export function useProject(id: string) {
  console.log("ID", id?.split("|"));
  return useQuery(
    ["projects", id],
    async () =>
      axios
        .post(`${backendUrl}/graphql`, {
          query: ProjectQuery,
          variables: {
            id: id.split("|")[1],
          },
        })
        .then((r) => r.data.data.retroPGF.project),
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
