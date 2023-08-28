import { type ImpactCategory } from "~/hooks/useCategories";
import { type List } from "~/hooks/useLists";
import { type Project } from "~/hooks/useProjects";

const categories = [
  "COLLECTIVE_GOVERNANCE",
  "OP_STACK",
  "DEVELOPER_ECOSYSTEM",
  "END_USER_EXPERIENCE_AND_ADOPTION",
];
export const projects: Project[] = Array.from({ length: 25 })
  .fill(0)
  .map((_, id) => ({
    id: String(id),
    applicantType: "PROJECT",
    displayName: `Project ${id + 1}`,
    bio: `Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.`,
    impactCategory: Array.from({
      length: Math.floor(Math.random() * 2) + 1,
    }).map((_, i) => categories[i]) as ImpactCategory[],
    websiteUrl: "https://www.example.com",
    contributionDescription: "Providing development services",
    contributionLinks: [
      {
        type: "GITHUB_REPO",
        url: "https://github.com/example/repo",
        description: "Github Repo",
      },
      {
        type: "CONTRACT_ADDRESS",
        url: "0x123",
        description: "Contract Address",
      },
    ],
    impactDescription: "Making positive changes in open source ecosystem.",
    impactMetrics: [
      {
        description: "Contributions to OP Stack",
        number: 500,
        url: "http://example.com/metrics1",
      },
      {
        description: "unique addresses interacted with the contract",
        number: 20_000,
        url: "http://example.com/metrics2",
      },
      {
        description: "unique visitors since March 2023",
        number: 50_100,
        url: "",
      },
      {
        description: "OP delegated via the application",
        number: 25_000_000,
        url: "",
      },
    ],
    fundingSources: [
      {
        type: "GOVERNANCE_FUND",
        currency: "OP",
        amount: 10000,
        description: "Seed fund",
      },
      {
        type: "RETROPGF_1",
        currency: "USD",
        amount: 20000,
        description: "Initial funding from xyz",
      },
    ],
    payoutAddress: "0x123",
    understoodKYCRequirements: true,
    understoodFundClaimPeriod: true,
    certifiedNotDesignatedOrSanctionedOrBlocked: true,
    certifiedNotSponsoredByPoliticalFigureOrGovernmentEntity: true,
    certifiedNotBarredFromParticipating: true,
  }));

export const lists: List[] = Array.from({ length: 25 })
  .fill(0)
  .map((_, id) => ({
    id: String(id),
    displayName: `List ${id + 1}`,
    creatorName: "verycoolperson",
    creatorAvatarUrl: "",
    bio: `Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.`,
    impactCategory: Array.from({
      length: Math.floor(Math.random() * 2) + 1,
    }).map((_, i) => categories[i]) as ImpactCategory[],
    projects,
    likesNumber: 12,
  }));
