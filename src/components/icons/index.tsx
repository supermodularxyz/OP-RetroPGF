import { type ComponentProps } from "react";
import { IconBase } from "react-icons";
import {
  FaHeart,
  FaRegHeart,
  FaXmark,
  FaBars,
  FaMagnifyingGlass,
  FaChevronLeft,
  FaListCheck,
  FaCheck,
  FaLink,
} from "react-icons/fa6";
import { FaExternalLinkSquareAlt } from "react-icons/fa";
import { HiCodeBracketSquare } from "react-icons/hi2";

import { LuArrowDownUp, LuLayoutGrid, LuList } from "react-icons/lu";

export const Like = FaRegHeart;
export const Liked = FaHeart;
export const X = FaXmark;
export const Menu = FaBars;
export const Search = FaMagnifyingGlass;
export const ChevronLeft = FaChevronLeft;
export const AddBallot = FaListCheck;
export const Sort = LuArrowDownUp;
export const Check = FaCheck;
export const LayoutGrid = LuLayoutGrid;
export const LayoutList = LuList;
export const Link = FaLink;
export const ExternalLink = FaExternalLinkSquareAlt;
export const Code = HiCodeBracketSquare;

export const Contribution = (props: ComponentProps<typeof IconBase>) => (
  <IconBase {...props}>
    <path
      d="M6.49219 0.578125L7.89844 3.60156L10.9219 5.00781C11.1094 5.10156 11.25 5.28906 11.25 5.5C11.25 5.73438 11.1094 5.92188 10.9219 6.01562L7.89844 7.42188L6.49219 10.4453C6.39844 10.6328 6.21094 10.75 6 10.75C5.76562 10.75 5.57812 10.6328 5.48438 10.4453L4.07812 7.42188L1.05469 6.01562C0.867188 5.92188 0.75 5.73438 0.75 5.5C0.75 5.28906 0.867188 5.10156 1.05469 5.00781L4.07812 3.60156L5.48438 0.578125C5.57812 0.390625 5.76562 0.25 6 0.25C6.21094 0.25 6.39844 0.390625 6.49219 0.578125Z"
      fill="currentColor"
    />
  </IconBase>
);
