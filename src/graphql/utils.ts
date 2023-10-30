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
  liked: "byLikes",
};

export function createQueryVariables({
  after,
  sort = "shuffle",
  search = "",
  seed,
  categories = [],
  likedBy = "",
}: Filter) {
  return {
    after,
    first: PAGE_SIZE,
    orderBy: sortMap[sort as keyof typeof sortMap] ?? sort,
    search,
    seed,
    category: categories.length ? categories : undefined,
    likedBy,
  };
}

export function parseId(item: { id: string }) {
  return {
    ...item,
    id: item.id.split("|")[1],
  };
}
