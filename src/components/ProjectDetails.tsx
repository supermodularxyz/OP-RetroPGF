import router from "next/router";
import { tv } from "tailwind-variants";
import Link from "next/link";
import { FaCheckToSlot } from "react-icons/fa6";
import * as HoverCard from "@radix-ui/react-hover-card";
import { useCopyToClipboard } from "react-use";

import { createComponent } from "~/components/ui";
import {
  ArrowLeft,
  ArrowRight,
  Code,
  Contribution,
  Github,
  LayoutList,
  Link as LinkIcon,
  Twitter,
} from "~/components/icons";
import {
  type Project,
  fundingSourcesLabels,
  // useListsForProject,
} from "~/hooks/useProjects";
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
import { useAllProjects } from "~/hooks/useProjects";
import { ProjectAddToBallot } from "./ProjectAddToBallot";
import { IconButton } from "./ui/Button";
import { useMemo, useRef } from "react";
import { useIntersection } from "react-use";
import clsx from "clsx";
import { type List } from "~/hooks/useLists";

export const ProjectDetails = ({ project }: { project: Project }) => {
  const [_, copy] = useCopyToClipboard();

  const { data: allProjects } = useAllProjects();
  // const { data: lists } = useListsForProject(project?.id);

  const currentIndex = useMemo(
    () => allProjects?.findIndex((p) => p.id === project?.id) ?? 0,
    [project, allProjects]
  );

  const intersectionRef = useRef(null);
  const intersection = useIntersection(intersectionRef, {
    root: null,
    rootMargin: "0px",
    threshold: 0,
  });

  async function handleNavigate(dir: number) {
    const id = allProjects?.[currentIndex + dir]?.id;
    if (id) await router.push(`/projects/${id}`);
  }

  return (
    <>
      <div
        className={clsx(
          "sticky left-0 top-0 mb-8 hidden items-center justify-between border-b border-gray-200 bg-white py-4 md:flex",
          {
            ["flex-row-reverse"]: !intersection?.isIntersecting,
          }
        )}
      >
        {!intersection?.isIntersecting ? (
          <ProjectAddToBallot project={project} />
        ) : (
          <h1 className="text-xl font-semibold">
            {project?.displayName}&apos;s Round application
          </h1>
        )}

        <div className="flex items-center gap-6">
          {intersection?.isIntersecting && (
            <p className="font-neutral-500 text-sm font-semibold">
              {currentIndex + 1} of {allProjects?.length} applications
            </p>
          )}
          <div className="flex flex-shrink-0 gap-2">
            <IconButton
              variant="outline"
              onClick={() => handleNavigate(-1)}
              icon={ArrowLeft}
              className="flex-shrink-0"
              disabled={!currentIndex}
            />
            <IconButton
              variant="outline"
              onClick={() => handleNavigate(+1)}
              icon={ArrowRight}
              className="flex-shrink-0"
              disabled={currentIndex + 1 === allProjects?.length}
            />
          </div>
        </div>
      </div>
      <div ref={intersectionRef}>
        <picture>
          <img
            alt={project?.profile?.name}
            src={project?.profile?.bannerImageUrl}
            className="h-32 rounded-xl border border-gray-200 bg-gray-100 md:h-[328px]"
          />
        </picture>
        <div className="-mt-20 items-end gap-6 md:ml-8 md:flex">
          <Avatar
            size="lg"
            alt={project?.profile?.name}
            src={project?.profile?.profileImageUrl}
          />
          <div className="flex-1 items-center justify-between md:flex">
            <div>
              <h3 className="mb-2 text-2xl font-bold">
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
      <div>
        <p className="">{project?.bio}</p>
        <div className="my-8 flex flex-wrap gap-2">
          <Tag>
            <FaCheckToSlot className="text-gray-500" /> 56 ballots
          </Tag>
          <Tag>
            <LayoutList className="text-gray-500" /> {project?.lists?.length}{" "}
            voting lists
          </Tag>
          <Tag>
            <Contribution className="text-gray-500" />
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
          <p>{project?.contributionDescription}</p>
          <div className="grid gap-2">
            {project?.contributionLinks?.map((link) => {
              const Icon = {
                GITHUB_REPO: LinkIcon,
                CONTRACT_ADDRESS: Code,
                OTHER: "div",
              }[link.type];

              return (
                <Link key={link.url} href={link.url} target="_blank">
                  <div className="space-y-6 rounded-3xl border border-gray-200 p-6">
                    <div className="flex  items-center gap-4 rounded-xl border border-gray-200">
                      <div className="h-20 w-20 rounded-l-xl bg-gray-100" />
                      <div>
                        <div className="mb-2 font-semibold text-gray-700">
                          {link.description}
                        </div>
                        <div className="flex items-center gap-1 text-gray-700 hover:underline ">
                          <LinkIcon />
                          <span className="text-sm font-semibold ">
                            {link.url}
                          </span>
                        </div>
                      </div>
                    </div>
                    <p>{link.description}</p>
                  </div>
                </Link>
              );
            })}
          </div>
          <DividerIcon icon={Contribution} className="my-4" />
          <H3>Impact</H3>
          <p>{project?.impactDescription}</p>
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
          <Card className="max-h-[680px] space-y-4 divide-y divide-gray-200 overflow-y-scroll">
            {project?.lists?.map((list) => (
              <Link
                key={list.id}
                href={`/lists/${list.id}`}
                className="pt-6 first:pt-0"
              >
                <ListListItem
                  list={list}
                  allocation={formatCurrency(
                    sumListAllocation(list),
                    "OP",
                    false
                  )}
                />
              </Link>
            ))}
          </Card>
        </div>
      </div>
    </>
  );
};

function sumListAllocation(list: List) {
  return list.listContent?.reduce((acc, x) => acc + x.OPAmount, 0);
}

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
