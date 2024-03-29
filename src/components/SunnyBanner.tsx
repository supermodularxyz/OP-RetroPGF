import { Sparkles, SunnyBackground, SunnyFace } from "./SunnySVG";
import { ExternalLink } from "./ui/Link";

export const SunnyBanner = () => (
  <div className="relative mx-auto mb-8 flex h-[572px] max-w-[320px] flex-col items-center px-2">
    <div className="absolute -z-10 overflow-hidden rounded-full">
      <SunnyBackground />
    </div>
    <div className="flex h-full flex-col items-center justify-between gap-8 px-4 py-8">
      <SunnyFace />
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">
          30 million OP for public goods
        </h3>
        <p>
          RetroPGF results are live! View nominated projects and the OP
          they&apos;ll receive for their contributions to Optimism
        </p>
        {/* <p>
          RetroPGF voting is live! View nominated projects that are eligible to
          receive retroactive public goods funding.
        </p> */}
        <div>
          <ExternalLink
            href="https://community.optimism.io/docs/governance/retropgf-3/"
            target="_blank"
          >
            View docs
          </ExternalLink>
        </div>
      </div>
      <Sparkles />
    </div>
  </div>
);
