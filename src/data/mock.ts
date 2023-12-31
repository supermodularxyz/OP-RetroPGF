import { type ImpactCategory } from "~/hooks/useCategories";

import projects from "./projects.json";
import { type Allocation } from "~/hooks/useBallot";

const categories = [
  "COLLECTIVE_GOVERNANCE",
  "OP_STACK",
  "DEVELOPER_ECOSYSTEM",
  "END_USER_EXPERIENCE_AND_ADOPTION",
];

export const lists: {
  id: string;
  listName: string;
  owner: string;
  bio: string;
  impactCategory: ImpactCategory[];
  impactEvaluation: string;
  impactEvaluationLink: string;
  listContent: { RPGF3_Application_UID: string; OPAmount: number }[];
}[] = Array.from({ length: 25 })
  .fill(0)
  .map((_, id) => ({
    id: String(id),
    listName: `List ${id + 1}`,
    displayName: `List ${id + 1}`,
    owner: "0x37a90040b3E01D19fCfE6FD50a9f31D967633707",
    bio: `Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.`,
    impactCategory: Array.from({
      length: Math.floor(Math.random() * 2) + 1,
    }).map((_, i) => categories[i]) as ImpactCategory[],
    impactEvaluation: `Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
              enim ad minim veniam, quis nostrud exercitation ullamco laboris
              nisi ut aliquip ex ea commodo consequasssd.`,
    impactEvaluationLink: "http://example.com/metrics1",
    listContent: projects
      .slice(0, Math.floor(Math.random() * 10) + 5)
      .map((p) => ({
        RPGF3_Application_UID: p.id,
        OPAmount: Math.floor(Math.random() * 100_000) + 100_000,
      })),
  }));

export const allListsLikes: Record<string, string[]> = lists.reduce(
  (obj, item) => ({ ...obj, [item.id]: ["0x", "0x", "0x"] }),
  {}
);
