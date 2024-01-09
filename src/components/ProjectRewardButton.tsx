import clsx from "clsx";

import { Button } from "~/components/ui/Button";

import { formatNumber } from "~/utils/formatNumber";
import { Star } from "./SunnySVG";

export function ProjectRewardButton({ amount }: { amount?: number }) {
  return (
    <div className="group relative">
      {amount ? (
        <>
          <Star className="absolute -top-1 left-2 h-4 w-4 group-hover:h-6 group-hover:w-6" />
          <Star className="absolute -bottom-2 right-2 h-8 w-8 group-hover:h-10 group-hover:w-10" />
        </>
      ) : null}
      <Button
        disabled={!amount}
        variant={amount ? "allocated" : "default"}
        className="min-w-48 w-full"
      >
        <span
          className={clsx(
            "mr-2 flex h-6 w-6 items-center justify-center rounded-full bg-gray-700 text-[10px] font-bold italic text-white",
            {
              ["bg-primary-600 "]: amount,
            }
          )}
        >
          OP
        </span>

        {amount ? formatNumber(amount) : "No allocation"}
      </Button>
    </div>
  );
}
