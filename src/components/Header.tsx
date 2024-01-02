import Link from "next/link";
import { useRouter } from "next/router";
import { type ComponentPropsWithRef, useState } from "react";
import clsx from "clsx";

import { OptimismLogo } from "~/components/OptimismLogo";
import { Search } from "./Search";
import { ConnectButton } from "./ConnectButton";
import { IconButton } from "./ui/Button";
import { Menu, X } from "./icons";
import { toURL, useFilter } from "~/hooks/useFilter";
import { useBallot } from "~/hooks/useBallot";

const navLinks = [
  {
    href: "/projects",
    children: "Projects",
    type: "projects",
  },
  {
    href: "/lists",
    children: "Lists",
    type: "lists",
  },
  {
    href: "/results",
    children: "Results",
    type: "results",
  },
  {
    href: "/stats",
    children: "Stats",
    type: "results",
  },
] as const;

const NavLink = ({
  isActive,
  ...props
}: { isActive: boolean } & ComponentPropsWithRef<typeof Link>) => (
  <Link
    className={clsx(
      "flex h-full items-center  border-gray-900 p-4 font-semibold text-gray-600",
      {
        ["border-b-[3px] !text-gray-900"]: isActive,
      }
    )}
    {...props}
  />
);

export const Header = () => {
  const { asPath, push } = useRouter();
  const [isOpen, setOpen] = useState(false);

  const params = {
    projects: useFilter("projects").data,
    lists: useFilter("lists").data,
  };

  const { data: ballot } = useBallot();
  return (
    <header className="relative z-[100] bg-white shadow-md">
      {ballot?.publishedAt && (
        <div className="h-16">
          <Link href={`/ballot/confirmation`}>
            <div className="absolute left-0 top-0 z-50 flex h-16 w-full items-center justify-center gap-2 bg-primary-600 text-primary-100 underline underline-offset-4 shadow-lg hover:bg-primary-500 ">
              The results are being tallied. You can see see your submitted
              ballot here.
            </div>
          </Link>
        </div>
      )}
      <div className="container mx-auto flex h-[72px] max-w-screen-2xl items-center px-2 sm:px-8">
        <div className="mr-4 flex items-center lg:mr-16">
          <IconButton
            icon={isOpen ? X : Menu}
            variant="ghost"
            className="mr-1 font-mono text-gray-600 lg:hidden"
            onClick={() => setOpen(!isOpen)}
          />
          <Link href={"/projects"} className="py-4">
            <OptimismLogo />
          </Link>
        </div>
        <div className="hidden h-full items-center gap-4 lg:flex">
          {navLinks.map((link) => (
            <NavLink
              isActive={asPath.startsWith(link.href)}
              key={link.href}
              href={`${link.href}?${toURL({
                ...params[link.type],
                // seed: Date.now().toString(),
              })}`}
            >
              {link.children}
            </NavLink>
          ))}
        </div>
        <div className="flex-1 lg:ml-8">
          <Search onSelect={(path) => void push(path)} />
        </div>
        <div className="ml-4 flex gap-4 lg:ml-8 xl:ml-32">
          <ConnectButton />
        </div>
        <MobileMenu isOpen={isOpen} />
      </div>
    </header>
  );
};

const MobileMenu = ({ isOpen = false }) => (
  <div
    className={clsx(
      "fixed left-0 top-16 z-10 h-full w-full bg-white transition-transform duration-150",
      {
        ["translate-x-full"]: !isOpen,
      }
    )}
  >
    {navLinks.map((link) => (
      <Link
        className={clsx("block p-4 text-2xl  font-semibold")}
        key={link.href}
        {...link}
      />
    ))}
  </div>
);
