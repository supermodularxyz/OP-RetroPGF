import { tv } from "tailwind-variants";
import { createComponent } from ".";

export const Table = createComponent("table", tv({ base: "" }));
export const Thead = createComponent("thead", tv({ base: "" }));
export const Tbody = createComponent("tbody", tv({ base: "" }));
export const Tr = createComponent(
  "tr",
  tv({ base: "border-b last:border-none" })
);
export const Th = createComponent("th", tv({ base: "text-left" }));
export const Td = createComponent("td", tv({ base: "px-1 py-2" }));
