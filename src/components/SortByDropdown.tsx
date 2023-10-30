import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { IconButton } from "./ui/Button";
import { sortLabels, type Filter } from "~/hooks/useFilter";
import { Check, Sort } from "./icons";

type Props = {
  value: Filter["sort"];
  onChange: (value: Filter["sort"]) => void;
  options: Filter["sort"][];
};

export const SortByDropdown = ({ value, onChange, options = [] }: Props) => {
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <IconButton icon={Sort} variant="outline" aria-label="Sort by">
          Sort by: {value && sortLabels[value]}
        </IconButton>
      </DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content
          className="z-50 w-[200px] rounded-xl border border-gray-300 bg-white p-2"
          sideOffset={5}
        >
          <DropdownMenu.Label className="p-2 text-xs font-semibold uppercase text-gray-700">
            Sort By
          </DropdownMenu.Label>
          <DropdownMenu.RadioGroup
            value={value}
            onValueChange={(v) => onChange(v as Filter["sort"])}
          >
            {options.map((value) => (
              <RadioItem key={value} value={value} label={sortLabels[value!]} />
            ))}
          </DropdownMenu.RadioGroup>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
};

const RadioItem = ({ value = "", label = "" }) => (
  <DropdownMenu.RadioItem
    className="cursor-pointer rounded p-2 pl-8 text-sm text-gray-900 hover:bg-gray-100"
    value={value}
  >
    <DropdownMenu.ItemIndicator className="absolute left-4">
      <Check className="h-4 w-4" />
    </DropdownMenu.ItemIndicator>
    {label}
  </DropdownMenu.RadioItem>
);
