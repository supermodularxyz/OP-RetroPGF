import { type Config } from "tailwindcss";

import colors from "tailwindcss/colors";
import theme from "tailwindcss/defaultTheme";

const optimismColors = {
  neutral: {
    0: "#ffffff",
    100: "#F1F4F9",
    200: "#E2E8F0",
    300: "#CBD5E0",
    400: "#A9B9CC",
    500: "#8496AE",
    600: "#68778D",
    700: "#4A5568",
    800: "#323A43",
    900: "#202327",
  },
  primary: {
    100: "#FFF0F1",
    200: "#FFDBDF",
    500: "#FF2941",
    600: "#FF0420",
    700: "#EB001A",
  },
  secondary: {
    100: "#EDF4FC",
    200: "#D7E6F9",
    600: "#2173DF",
    700: "#1C65C4",
  },
  success: {
    100: "#EEF6EE",
    200: "#DEEDDE",
    600: "#5BA85A",
    700: "#3F753E",
    800: "#3F753E",
  },
  error: {
    100: "#FDF6F2",
    200: "#FAEAE0",
    600: "#DD6B20",
    700: "#C45F1C",
  },
  highlight: {
    600: "#F3CF00",
  },
};

export default {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        ...colors,
        ...optimismColors,
        gray: optimismColors.neutral,
        muted: optimismColors.neutral["600"],
      },
      fontFamily: {
        sans: ["var(--font-inter)", ...theme.fontFamily.sans],
      },
    },
  },
  plugins: [],
} satisfies Config;
