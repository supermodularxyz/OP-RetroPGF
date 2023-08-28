import { tv } from "tailwind-variants";
import { createComponent } from "~/components/ui";
import { IconButton } from "~/components/ui/Button";
import { AddBallot, Contribution, LayoutList } from "~/components/icons";
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

export const ProjectDetails = ({ project }: { project: Project }) => {
  return (
    <>
      <div className="mb-8 flex justify-between">
        <h1 className="text-xl font-semibold">
          {project?.displayName}&apos;s Round application
        </h1>
        <div className="">PROJECT_NAVIGATION</div>
      </div>
      <div>
        <div className="h-[328px] rounded-xl border border-gray-200 bg-gray-100" />
        <div className="mx-8 -mt-20 flex items-end gap-6">
          <Avatar size="lg" />
          <div className="flex flex-1 items-center justify-between">
            <div>
              <h3 className="text-2xl font-bold">{project?.displayName}</h3>
              <div className="flex items-center gap-4 text-gray-700">
                <div className="flex items-center gap-2">
                  <code>{project?.payoutAddress}</code>
                  <CopyButton value={project?.payoutAddress} />
                </div>
                {project?.websiteUrl ? (
                  <Link href={project?.websiteUrl} target="_blank">
                    {project?.websiteUrl}
                  </Link>
                ) : null}
              </div>
            </div>
            <div>
              <IconButton variant="primary" icon={AddBallot}>
                Add to ballot
              </IconButton>
            </div>
          </div>
        </div>
      </div>
      <Divider className="my-8" />
      <p className="">{project?.bio}</p>
      <div className="my-8 flex gap-2">
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

        {project?.contributionLinks.map((link) => (
          <ImpactCard key={link.url} className="space-y-2">
            <H4>{link.description}</H4>
            <p>TODO: contribution description</p>
            <div>{link.url}</div>
          </ImpactCard>
        ))}
        <DividerIcon icon={Contribution} className="my-4" />

        <H3>Impact</H3>
        <p>{project?.impactDescription}</p>
        <div className="grid grid-cols-3 gap-2">
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
              <div className="flex flex-1 justify-between">
                <div className="flex">
                  <div className="w-64 text-lg">
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
