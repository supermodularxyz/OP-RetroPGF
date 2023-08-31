import { IconButton } from "~/components/ui/Button";
import { MoreHorizontal } from "~/components/icons";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { createElement } from "react";
import Link from "next/link";
import { type IconBase } from "react-icons";

export const MoreDropdown = ({
  options,
}: {
  options: {
    label: string;
    value: string;
    icon: typeof IconBase;
    href: string;
  }[];
}) => {
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <IconButton
          className="text-neutral-500"
          icon={MoreHorizontal}
          variant={"outline"}
        />
      </DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content
          className="w-[200px] rounded-2xl border border-gray-300 bg-white p-2"
          sideOffset={5}
        >
          <DropdownMenu.Group>
            {options.map((option) => (
              <div
                key={option.value}
                className="flex items-center gap-3 px-2 py-3"
              >
                {createElement(option.icon, { className: "text-neutral-600" })}
                <Link href={option.href} className="text-neutral-600">
                  {option.label}
                </Link>
              </div>
            ))}
          </DropdownMenu.Group>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
};
