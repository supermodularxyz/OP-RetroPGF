import { tv } from "tailwind-variants";
import { createComponent } from "~/components/ui";
import { IconButton } from "~/components/ui/Button";
import {
  AddBallot,
  Check,
  Code,
  Contribution,
  LayoutList,
  Link as LinkIcon,
} from "~/components/icons";
import { type Project, fundingSourcesLabels } from "~/hooks/useProjects";
import Link from "next/link";
import { FaCheckToSlot } from "react-icons/fa6";
import { Divider, DividerIcon } from "~/components/ui/Divider";
import { Tag } from "~/components/ui/Tag";
import { SunnyMini } from "~/components/SunnySVG";
import { ListListItem } from "~/components/Lists";
import { impactCategoryLabels } from "~/hooks/useCategories";
import { LuArrowUpRight } from "react-icons/lu";
import { lists } from "~/data/mock";
import { suffixNumber } from "~/utils/suffixNumber";
import { formatCurrency } from "~/utils/formatCurrency";
import { Avatar } from "~/components/ui/Avatar";
import { CopyButton } from "~/components/CopyButton";
import {
  useAddToBallot,
  useBallot,
  useRemoveFromBallot,
} from "~/hooks/useBallot";
import { formatNumber } from "~/utils/formatNumber";

export const AddProjectToBallot = ({ project }: { project: Project }) => {
  const add = useAddToBallot();
  const remove = useRemoveFromBallot();
  const { data: ballot } = useBallot();

  const { id } = project ?? {};
  const inBallot = ballot?.[id];
  return (
    <div>
      {inBallot ? (
        <IconButton
          variant="outline"
          icon={Check}
          onClick={() => remove.mutate(project)}
        >
          {formatNumber(inBallot.amount)} OP allocated
        </IconButton>
      ) : (
        <IconButton
          onClick={() => add.mutate([{ ...project, amount: 0 }])}
          variant="primary"
          icon={AddBallot}
          className="w-full md:w-auto"
        >
          Add to ballot
        </IconButton>
      )}
    </div>
  );
};

export const ProjectDetails = ({ project }: { project: Project }) => {
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
        <div className="-mt-20 items-end gap-6 md:mx-8 md:flex">
          <Avatar size="lg" />
          <div className="flex-1 items-center justify-between md:flex">
            <div>
              <h3 className="text-2xl font-bold">{project?.displayName}</h3>
              <div className="flex items-center gap-1 text-gray-700">
                <div className="flex items-center gap-2">
                  <code>{project?.payoutAddress}</code>
                  <CopyButton value={project?.payoutAddress} />
                </div>
                <div>·</div>
                {project?.websiteUrl ? (
                  <IconButton
                    as={Link}
                    variant="link"
                    icon={LinkIcon}
                    href={project?.websiteUrl}
                    target="_blank"
                  >
                    {project?.websiteUrl}
                  </IconButton>
                ) : null}
              </div>
            </div>
            <AddProjectToBallot project={project} />
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
            <Tag key={category}>{impactCategoryLabels[category]}</Tag>
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
            return (
              <ImpactCard key={link.url} className="space-y-2">
                <H4>{link.description}</H4>
                <p>{link.description}</p>
                <div className="flex items-center gap-1 text-gray-700">
                  <Icon className="h-4 w-4" />
                  {link.url}
                </div>
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
            <ListListItem
              key={list.id}
              list={list}
              allocation={formatCurrency(36_000, "OP", false)}
            />
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
