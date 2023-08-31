import { type IconBase } from "react-icons";
import { createElement } from "react";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";

import { IconButton } from "~/components/ui/Button";
import { MoreHorizontal } from "~/components/icons";

type Props = {
  align?: "start" | "center" | "end";
  options: {
    label: string;
    value: string;
    icon?: typeof IconBase;
    href?: string;
    target?: string;
    onClick?: () => void;
  }[];
};

export const MoreDropdown = ({ align, options }: Props) => {
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
          align={align}
          className="rounded-2xl border border-gray-300 bg-white p-2"
          sideOffset={5}
        >
          <DropdownMenu.Group>
            {options.map((option) => (
              <DropdownMenu.Item
                key={option.value}
                {...option}
                className="flex cursor-pointer items-center gap-3 p-2 text-gray-700  hover:text-gray-900"
              >
                {option.icon ? createElement(option.icon, {}) : null}
                {option.label}
              </DropdownMenu.Item>
            ))}
          </DropdownMenu.Group>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
};
