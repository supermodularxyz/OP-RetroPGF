import Link from "next/link";
import { useRouter } from "next/router";
import { type ComponentPropsWithRef, useState } from "react";
import clsx from "clsx";

import { OptimismLogo } from "~/components/OptimismLogo";
import { Search } from "./Search";
import { ConnectButton } from "./ConnectButton";
import { IconButton } from "./ui/Button";
import { Chip } from "./ui/Chip";
import { toURL, useFilter } from "~/hooks/useFilter";
import { Menu, X } from "./icons";

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
];

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
  const { data: projectsFilter } = useFilter("projects");
  const { data: listsFilter } = useFilter("lists");

  return (
    <header className="relative z-10 bg-white shadow-md">
      <div className="container mx-auto  flex h-[72px] max-w-screen-2xl items-center px-2  md:px-8">
        <div className="mr-4 flex items-center lg:mr-16">
          <IconButton
            icon={isOpen ? X : Menu}
            variant="ghost"
            className="mr-1 font-mono text-gray-600 md:hidden"
            onClick={() => setOpen(!isOpen)}
          />
          <OptimismLogo />
        </div>
        <div className="hidden h-full items-center gap-4 md:flex">
          {navLinks.map((link) => (
            <NavLink
              isActive={asPath.startsWith(link.href)}
              key={`${link.href}?${toURL({}, 
                link.type == "projects" ? projectsFilter : listsFilter
              )}`}
              {...link}
            />
          ))}
        </div>
        <div className="flex-1 md:ml-8">
          <Search onSelect={(type, id) => void push(`/${type}/${id}`)} />
        </div>
        <div className="ml-4 flex gap-4 md:ml-8 xl:ml-32">
          <ConnectButton />
          <Chip className="hidden">T</Chip>
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
