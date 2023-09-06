import { tv } from "tailwind-variants";
import { createComponent } from "~/components/ui";
import {
  Code,
  Contribution,
  Github,
  LayoutList,
  Link as LinkIcon,
  Twitter,
} from "~/components/icons";
import { type Project, fundingSourcesLabels } from "~/hooks/useProjects";
import Link from "next/link";
import { FaCheckToSlot } from "react-icons/fa6";
import { Divider, DividerIcon } from "~/components/ui/Divider";
import { Tag } from "~/components/ui/Tag";
import { SunnyMini } from "~/components/SunnySVG";
import { ListListItem } from "~/components/Lists";
import {
  impactCategoryDescriptions,
  impactCategoryLabels,
} from "~/hooks/useCategories";
import { LuArrowUpRight } from "react-icons/lu";
import { lists } from "~/data/mock";
import { suffixNumber } from "~/utils/suffixNumber";
import { formatCurrency } from "~/utils/formatCurrency";
import { Avatar } from "~/components/ui/Avatar";

import * as HoverCard from "@radix-ui/react-hover-card";
import { MoreDropdown } from "./MoreDropdown";
import { useCopyToClipboard } from "react-use";
import { IconBadge } from "./ui/Badge";

import { ProjectAddToBallot } from "./ProjectAddToBallot";

export const ProjectDetails = ({ project }: { project: Project }) => {
  const [_, copy] = useCopyToClipboard();

  return (
    <>
      <div className="mb-8 hidden justify-between md:flex">
        <h1 className="text-xl font-semibold">
          {project?.displayName}&apos;s Round application
        </h1>
        <div className="">PROJECT_NAVIGATION</div>
      </div>
      <div>
        <div className="h-32 rounded-xl border border-gray-200 bg-gray-100 md:h-[328px]" />
        <div className="-mt-20 items-end gap-6 md:ml-8 md:flex">
          <Avatar size="lg" />
          <div className="flex-1 items-center justify-between md:flex">
            <div>
              <h3 className="mb-2 text-2xl font-bold">
                {project?.displayName}
              </h3>
              <div className="flex items-center gap-2">
                <IconBadge
                  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
                  icon={Github}
                  as={Link}
                  target="_blank"
                  href={`https://www.github.com/`}
                >
                  GitHub
                </IconBadge>
                <IconBadge
                  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
                  icon={Twitter}
                  as={Link}
                  target="_blank"
                  href={`https://www.twitter.com/`}
                >
                  Twitter
                </IconBadge>
                <IconBadge
                  icon={LinkIcon}
                  as={Link}
                  target="_blank"
                  href={project?.websiteUrl ?? "#"}
                >
                  Website
                </IconBadge>
              </div>
            </div>
            <div className="flex gap-2">
              <MoreDropdown
                align="start"
                options={[
                  {
                    value: "copy",
                    label: "Copy address",
                    onClick: () => copy(project.payoutAddress),
                  },
                  {
                    value: "profile",
                    label: "View Optimist Profile",
                    onClick: () => alert("View Optimist Profile"),
                  },
                  {
                    value: "flag",
                    label: "Report",
                    onClick: () => alert("Report"),
                  },
                ]}
              />
              <ProjectAddToBallot project={project} />
            </div>
          </div>
        </div>
      </div>
      <Divider className="my-8" />
      <p className="">{project?.bio}</p>
      <div className="my-8 flex flex-wrap gap-2">
        <Tag>
          <FaCheckToSlot /> 56 ballots
        </Tag>
        <Tag>
          <LayoutList /> 18 voting lists
        </Tag>
        <Tag>
          <Contribution />
          Round 2 contributor
        </Tag>
      </div>
      <Card>
        <div className="flex items-center gap-4">
          <SunnyMini className="text-primary-600" />
          <H3>Impact statement for RetroPGF 3</H3>
        </div>
        <p className="">{project?.impactDescription}</p>

        <h6 className="mb-1 text-sm font-semibold text-gray-500">
          Categories of impact
        </h6>
        <div className="flex flex-wrap gap-1">
          {project?.impactCategory.map((category) => (
            <HoverTagCard
              key={category}
              tag={impactCategoryLabels[category]}
              description={impactCategoryDescriptions[category]}
              includedProjectsNumber={1}
              totalProjectsNumber={150}
            />
          ))}
        </div>
        <DividerIcon icon={Contribution} className="my-4" />

        <H3>Contributions</H3>

        <p>{project?.contributionDescription}</p>

        <div className="grid gap-2">
          {project?.contributionLinks.map((link) => {
            const Icon = {
              GITHUB_REPO: LinkIcon,
              CONTRACT_ADDRESS: Code,
              OTHER: "div",
            }[link.type];

            const linkUrl = {
              GITHUB_REPO: link.url,
              CONTRACT_ADDRESS: `https://optimistic.etherscan.io/address/${link.url}`,
              OTHER: link.url,
            }[link.type];
            return (
              <ImpactCard key={link.url} className="space-y-2">
                <H4>{link.description}</H4>
                <p>{link.description}</p>
                <Link
                  href={linkUrl}
                  target="_blank"
                  className="flex items-center gap-1 text-gray-700 hover:underline "
                >
                  <Icon className="h-4 w-4" />
                  {link.url}
                </Link>
              </ImpactCard>
            );
          })}
        </div>
        <DividerIcon icon={Contribution} className="my-4" />

        <H3>Impact</H3>
        <p>{project?.impactDescription}</p>
        <div className="grid gap-2 md:grid-cols-3">
          {project?.impactMetrics.map((metric, i) => (
            <ImpactCard
              as={metric.url ? Link : "div"}
              href={metric.url ?? "#"}
              target={metric.url ? "_blank" : ""}
              key={i}
            >
              <div className="flex justify-between">
                <H4 className="font-mono">{suffixNumber(metric.number)}</H4>
                {metric.url ? (
                  <LuArrowUpRight className="text-gray-500" />
                ) : null}
              </div>
              <p className="text-gray-700">{metric.description}</p>
            </ImpactCard>
          ))}
        </div>
        <DividerIcon icon={Contribution} className="my-4" />

        <H3>Past funding</H3>

        <div className="flex flex-col gap-4 divide-y divide-gray-200">
          {project?.fundingSources.map((fund, i) => (
            <div className="flex pt-6" key={i}>
              <div className="flex-1 justify-between md:flex">
                <div className="md:flex">
                  <div className="text-lg md:w-64">
                    {fundingSourcesLabels[fund.type]}
                  </div>
                  <div className="">{fund.description}</div>
                </div>
                <H4 className="font-mono">
                  {formatCurrency(fund.amount, fund.currency)}
                </H4>
              </div>
            </div>
          ))}
        </div>
      </Card>
      <div className="mt-12 space-y-4">
        <H3>Included in the following lists</H3>
        <Card className="space-y-4 divide-y divide-gray-200">
          {lists.slice(0, 3).map((list) => (
            <Link key={list.id} href={`/lists/${list.id}`}>
              <ListListItem
                list={list}
                allocation={formatCurrency(36_000, "OP", false)}
              />
            </Link>
          ))}
        </Card>
      </div>
    </>
  );
};

const H3 = createComponent("h3", tv({ base: "text-2xl font-semibold" }));
const H4 = createComponent("h4", tv({ base: "text-xl font-semibold" }));
const Card = createComponent(
  "div",
  tv({ base: "flex flex-col gap-4 rounded-3xl border p-8" })
);
const ImpactCard = createComponent(
  "div",
  tv({
    base: "rounded-xl bg-gray-100 p-4",
  })
);

export const HoverTagCard = ({
  tag,
  description,
  includedProjectsNumber,
  totalProjectsNumber,
}: {
  tag: string;
  description: string;
  includedProjectsNumber: number;
  totalProjectsNumber: number;
}) => {
  return (
    <HoverCard.Root>
      <HoverCard.Trigger asChild>
        <Tag>{tag}</Tag>
      </HoverCard.Trigger>
      <HoverCard.Portal>
        <HoverCard.Content className="HoverCardContent" sideOffset={5}>
          <div className="flex max-w-xs gap-6 rounded-xl bg-neutral-0 p-6 shadow-md">
            <div className="grid gap-1">
              <h5 className="font-semibold">{tag}</h5>
              <p className="text-sm text-neutral-700">{description}</p>
              <p className="mt-2 text-xs text-neutral-500">
                {includedProjectsNumber} of {totalProjectsNumber} projects
              </p>
            </div>
            <Avatar size={"sm"} className="flex-shrink-0" />
          </div>
        </HoverCard.Content>
      </HoverCard.Portal>
    </HoverCard.Root>
  );
};
