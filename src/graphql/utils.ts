import { Filter } from "~/hooks/useFilter";

export type Aggregate = {
  total: number;
  collectiveGovernance: number;
  developerEcosystem: number;
  endUserExperienceAndAdoption: number;
  opStack: number;
};

export const PAGE_SIZE = 12;

export const sortMap = {
  shuffle: "shuffle",
  asc: "alphabeticalAZ",
  desc: "alphabeticalZA",
  liked: "byIncludedInBallots",
};

export function createQueryVariables({
  page = 1,
  sort = "shuffle",
  search = "",
  seed,
  categories = [],
}: Filter) {
  return {
    first: PAGE_SIZE,
    skip: (page - 1) * PAGE_SIZE,
    orderBy: sortMap[sort as keyof typeof sortMap] ?? sort,
    search,
    seed,
    category: categories.length ? categories : undefined,
  };
}

export function parseId(item: { id: string }) {
  return {
    ...item,
    id: item.id.split("|")[1],
  };
}
