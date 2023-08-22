import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { Button } from "./ui/Button";
import { sortLabels, type Filter } from "~/hooks/useFilter";

type Props = {
  value: Filter["sort"];
  onChange: (value: string) => void;
};
export const SortBy = ({ value, onChange }: Props) => {
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <Button variant="outline" aria-label="Sort by">
          [S] Sort by: {value && sortLabels[value]}
        </Button>
      </DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content
          className="w-[200px] rounded-xl border border-gray-300 bg-white p-2"
          sideOffset={5}
        >
          <DropdownMenu.Label className="p-2 text-xs font-semibold uppercase text-gray-700">
            Sort By
          </DropdownMenu.Label>
          <DropdownMenu.RadioGroup value={value} onValueChange={onChange}>
            <RadioItem value="shuffle" label={sortLabels.shuffle} />
            <RadioItem value="asc" label={sortLabels.asc} />
            <RadioItem value="desc" label={sortLabels.desc} />
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
      [C]
    </DropdownMenu.ItemIndicator>
    {label}
  </DropdownMenu.RadioItem>
);
