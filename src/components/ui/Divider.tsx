import { tv } from "tailwind-variants";
import { createComponent } from ".";

export const Divider = createComponent("div", tv({ base: "border-b" }));
