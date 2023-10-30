import axios from "axios";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { initialFilter, type Filter } from "./useFilter";
import { type ImpactCategory } from "./useCategories";
import { mapList, type List } from "~/hooks/useLists";
import { ProjectQuery, ProjectsQuery } from "~/graphql/queries";
import { Aggregate, createQueryVariables, parseId } from "~/graphql/utils";

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
  lists: List[];
};

export const fundingSourcesLabels = {
  RETROPGF_1: "RetroPGF 1",
  RETROPGF_2: "RetroPGF 2",
  GOVERNANCE_FUND: "Governance Fund",
  PARTNER_FUND: "Partner Fund",
  REVENUE: "Revenue",
  OTHER: "Other",
};

const backendUrl = process.env.NEXT_PUBLIC_BACKEND_API!;

export function useProjects(
  filter: Filter = initialFilter,
  opts?: { enabled?: boolean }
) {
  const query = useInfiniteQuery({
    enabled: opts?.enabled,
    queryKey: ["projects", filter],
    queryFn: ({ pageParam }: { pageParam?: string }) => {
      console.log("Fetching projects", pageParam);
      return axios
        .post<{
          data: {
            retroPGF: {
              projects: {
                edges: { node: Project }[];
                pageInfo: { hasNextPage: boolean; endCursor?: string };
              };
              projectsAggregate: Aggregate;
            };
          };
        }>(`${backendUrl}/graphql`, {
          query: ProjectsQuery,
          variables: createQueryVariables({ ...filter, after: pageParam }),
        })
        .then((r) => {
          const { projects, projectsAggregate } = r.data.data?.retroPGF ?? {};

          const data = projects?.edges.map((edge) => mapProject(edge.node));
          const { total = 0, ...categories } = projectsAggregate ?? {};

          return { data, categories, pageInfo: projects?.pageInfo };
        })
        .catch((err) => {
          console.log("err", err);
          return {
            data: [],
            categories: {},
            pageInfo: { endCursor: null },
          };
        });
    },
    getNextPageParam: (lastPage) => {
      return lastPage.pageInfo?.endCursor;
    },
  });

  return {
    ...query,
    data: query.data?.pages?.flatMap((p) => p.data).filter(Boolean),
    fetchNextPage: () => {
      return (
        query.hasNextPage &&
        query.fetchNextPage({
          pageParam:
            query.data?.pages?.[query.data?.pages?.length - 1]?.pageInfo
              .endCursor,
        })
      );
    },
  };
}

export function useProject(id: string) {
  return useQuery(
    ["projects", id],
    async () =>
      axios
        .post<{ data: { retroPGF: { project: Project } } }>(
          `${backendUrl}/graphql`,
          { query: ProjectQuery, variables: { id } }
        )
        .then((r) => mapProject(r.data.data?.retroPGF.project) ?? null),
    { enabled: Boolean(id) }
  );
}

function mapProject(project: Project) {
  return {
    ...parseId(project),
    lists: project.lists.map(mapList),
  } as Project;
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
      arr.sort((a: T, b: T) => Number(a.amount) - Number(b.amount)),
    descOP: (arr: T[]) =>
      arr.sort((a: T, b: T) => Number(b.amount) - Number(a.amount)),
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
