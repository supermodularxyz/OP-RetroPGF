import NextLink from "next/link";
import { type ComponentProps } from "react";
import { ExternalLink as ExternalLinkIcon } from "../icons";
import { createComponent } from ".";
import { tv } from "tailwind-variants";

export const Link = createComponent(
  NextLink,
  tv({
    base: "font-semibold underline-offset-2 hover:underline text-secondary-600",
  })
);

export const ExternalLink = ({
  children,
  ...props
}: ComponentProps<typeof NextLink>) => (
  <NextLink
    className="flex items-center gap-2 font-semibold underline-offset-2 hover:underline"
    {...props}
  >
    {children} <ExternalLinkIcon className="h-4 w-4" />
  </NextLink>
);
