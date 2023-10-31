import { useRef } from "react";
import { useIntersection } from "react-use";
import clsx from "clsx";
import { tv } from "tailwind-variants";
import Link from "next/link";
import { FaCheckToSlot } from "react-icons/fa6";
import * as HoverCard from "@radix-ui/react-hover-card";
import { useCopyToClipboard } from "react-use";

import { createComponent } from "~/components/ui";
import { Contribution, LayoutList, Link as LinkIcon } from "~/components/icons";
import { type Project, fundingSourcesLabels } from "~/hooks/useProjects";
import { Divider, DividerIcon } from "~/components/ui/Divider";
import { Tag } from "~/components/ui/Tag";
import { SunnyMini } from "~/components/SunnySVG";
import { ListListItem } from "~/components/Lists";
import {
  impactCategoryDescriptions,
  impactCategoryLabels,
} from "~/hooks/useCategories";
import { LuArrowUpRight } from "react-icons/lu";
import { suffixNumber } from "~/utils/suffixNumber";
import { formatCurrency } from "~/utils/formatCurrency";
import { Avatar } from "~/components/ui/Avatar";

import { MoreDropdown } from "./MoreDropdown";
import { IconBadge } from "./ui/Badge";
import { ProjectAddToBallot } from "./ProjectAddToBallot";

import { type List } from "~/hooks/useLists";
import { ProjectContribution } from "./ProjectContribution";
import { BlurredBannerImage } from "./ui/BlurredBannerImage";

const reportUrl = process.env.NEXT_PUBLIC_REPORT_URL;

export const ProjectDetails = ({ project }: { project: Project }) => {
  const [_, copy] = useCopyToClipboard();

  const intersectionRef = useRef(null);
  const intersection = useIntersection(intersectionRef, {
    root: null,
    rootMargin: "0px",
    threshold: 0,
  });

  const { bannerImageUrl, profileImageUrl } = project?.profile ?? {};
  return (
    <>
      <div
        className={clsx(
          "sticky left-0 top-0 z-10 mb-8 hidden items-center justify-between border-b border-gray-200 bg-white py-4 md:flex",
          {
            ["flex-row-reverse"]: !intersection?.isIntersecting,
          }
        )}
      >
        {!intersection?.isIntersecting ? (
          <ProjectAddToBallot project={project} />
        ) : null}
        <h1 className="flex h-12 items-center text-xl font-semibold">
          {project?.displayName}&apos;s Round application
        </h1>
      </div>
      <div ref={intersectionRef}>
        <BlurredBannerImage
          className="h-32 md:h-[328px]"
          src={bannerImageUrl}
          fallbackSrc={profileImageUrl}
        />

        <div className="relative -mt-20 items-end gap-6 md:ml-8 md:flex">
          <Avatar
            size="lg"
            alt={project?.profile?.name}
            src={project?.profile?.profileImageUrl}
          />
          <div className="flex-1 items-center justify-between md:flex">
            <div>
              <h3 className="mb-2 truncate text-2xl font-bold">
                {project?.displayName}
              </h3>
              <div>
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
            <div className="flex flex-1 gap-2">
              <MoreDropdown
                align="start"
                options={[
                  {
                    value: "copy",
                    label: "Copy address",
                    onClick: () => copy(project.payoutAddress),
                  },
                  // {
                  //   value: "profile",
                  //   label: "View Optimist Profile",
                  //   onClick: () => alert("View Optimist Profile"),
                  // },
                  // {
                  //   value: "flag",
                  //   label: "Report",
                  //   onClick: () => window.open(reportUrl),
                  // },
                ]}
              />
              <ProjectAddToBallot project={project} />
            </div>
          </div>
        </div>
      </div>
      <Divider className="my-8" />
      <div>
        <p className="whitespace-pre-wrap">{project?.bio}</p>
        <div className="my-8 flex flex-wrap gap-2">
          <Tag>
            <FaCheckToSlot className="text-gray-500" />
            {`?`} ballots
          </Tag>
          <Tag>
            <LayoutList className="text-gray-500" /> {project?.lists?.length}{" "}
            voting lists
          </Tag>
        </div>
        <Card>
          <div className="flex items-center gap-4">
            <SunnyMini className="text-primary-600" />
            <H3>Impact statement for RetroPGF 3</H3>
          </div>
          <p className="whitespace-pre-wrap">{project?.impactDescription}</p>
          <h6 className="mb-1 text-sm font-semibold text-gray-500">
            Categories of impact
          </h6>
          <div className="flex flex-wrap gap-1">
            {project?.impactCategory?.map((category) => (
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
          <p className="whitespace-pre-wrap">
            {project?.contributionDescription}
          </p>
          <div className="flex flex-col gap-2">
            {project?.contributionLinks?.map((link) => {
              return <ProjectContribution key={link.url} link={link} />;
            })}
          </div>
          <DividerIcon icon={Contribution} className="my-4" />
          <H3>Impact</H3>
          <p className="whitespace-pre-wrap">{project?.impactDescription}</p>
          <div className="grid gap-2 md:grid-cols-3">
            {project?.impactMetrics?.map((metric, i) => (
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
          <H3>Past grants and funding</H3>

          <div className="flex flex-col gap-4 divide-y divide-gray-200">
            {project?.fundingSources?.map((fund, i) => (
              <div className="flex pt-6" key={i}>
                <div className="flex-1 justify-between md:flex">
                  <div className="md:flex">
                    <div className="text-lg md:w-64">
                      {fundingSourcesLabels[fund.type]}
                    </div>
                    <div>{fund.description}</div>
                  </div>
                  <H4 className="whitespace-nowrap font-mono text-sm md:text-base">
                    {formatCurrency(fund.amount, fund.currency)}
                  </H4>
                </div>
              </div>
            ))}
          </div>
        </Card>
        <div className="mt-12 space-y-4">
          <H3>Included in the following lists</H3>
          <Card className="max-h-[680px] space-y-4 divide-y divide-gray-200 overflow-y-scroll">
            {project?.lists.length ? (
              project?.lists
                ?.map((list) => ({
                  ...list,
                  // Get the allocation for this project
                  projectAmount: findAllocationForProject(project.id, list),
                }))
                .sort((a, b) => b.projectAmount - a.projectAmount)
                .map((list) => {
                  return (
                    <Link
                      key={list.id}
                      href={`/lists/${list.id}`}
                      className="pt-6 first:pt-0"
                    >
                      <ListListItem
                        list={list}
                        allocation={formatCurrency(
                          list.projectAmount,
                          "OP",
                          false
                        )}
                      />
                    </Link>
                  );
                })
            ) : (
              <div>This project is not included in any lists.</div>
            )}
          </Card>
        </div>
      </div>
    </>
  );
};

function findAllocationForProject(projectId: string, list: List) {
  return (
    list.listContent.find((p) => p.project.id === projectId)?.OPAmount ?? 0
  );
}

const H3 = createComponent(
  "h3",
  tv({ base: "text-xl md:text-2xl font-semibold" })
);
const H4 = createComponent(
  "h4",
  tv({ base: "text-lg md:text-xl font-semibold" })
);
const Card = createComponent(
  "div",
  tv({ base: "flex flex-col gap-4 rounded-3xl border p-4 md:p-8" })
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
