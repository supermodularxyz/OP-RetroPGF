import Link from "next/link";
import { type ComponentProps } from "react";
import { ExternalLink as ExternalLinkIcon } from "../icons";

export const ExternalLink = ({
  children,
  ...props
}: ComponentProps<typeof Link>) => (
  <Link
    className="flex items-center gap-2 font-semibold underline-offset-2 hover:underline"
    {...props}
  >
    {children} <ExternalLinkIcon className="h-4 w-4" />
  </Link>
);
