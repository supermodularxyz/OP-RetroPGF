import Link from "next/link";
import { useRouter } from "next/router";
import { type ComponentPropsWithRef, useState } from "react";
import clsx from "clsx";

import { OptimismLogo } from "~/components/OptimismLogo";
import { Search } from "./Search";
import { ConnectButton } from "./ConnectButton";
import { Button } from "./ui/Button";
import { Chip } from "./ui/Chip";

const navLinks = [
  {
    href: "/projects",
    children: "Projects",
  },
  {
    href: "/lists",
    children: "Lists",
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

  return (
    <header className="relative z-10 bg-white shadow-md">
      <div className="container mx-auto  flex h-[72px] max-w-screen-2xl items-center px-2  md:px-8">
        <div className="mr-4 flex items-center lg:mr-16">
          <Button
            className="font-mono md:hidden"
            onClick={() => setOpen(!isOpen)}
          >
            {isOpen ? "x" : "m"}
          </Button>
          <OptimismLogo />
        </div>
        <div className="hidden h-full items-center gap-4 md:flex">
          {navLinks.map((link) => (
            <NavLink
              isActive={asPath.startsWith(link.href)}
              key={link.href}
              {...link}
            />
          ))}
        </div>
        <div className="flex-1 md:ml-8">
          <Search onSelect={(type, id) => void push(`/${type}/${id}`)} />
        </div>
        <div className="ml-4 flex gap-4 md:ml-8 xl:ml-32">
          <ConnectButton />
          <Chip className="hidden md:block">T</Chip>
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
