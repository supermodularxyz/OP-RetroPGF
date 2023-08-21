import Link from "next/link";
import { type ComponentProps } from "react";

export const ExternalLink = ({
  children,
  ...props
}: ComponentProps<typeof Link>) => (
  <Link className="font-semibold" {...props}>
    {children} [icon]
  </Link>
);
