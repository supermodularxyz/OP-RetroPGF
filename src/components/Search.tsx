import { Chip } from "./ui/Chip";

export const Search = () => (
  <div className="flex justify-end">
    <div>
      <Chip className="md:hidden">S</Chip>
    </div>
    <input
      className="hidden w-full rounded-xl border p-3 md:flex"
      type="search"
      placeholder="Search projects or lists"
    />
  </div>
);
