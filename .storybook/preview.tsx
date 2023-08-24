import type { Preview } from "@storybook/react";

import React from "react";

import { Providers } from "~/providers";
import "../src/styles/globals.css";

const preview: Preview = {
  parameters: {
    actions: { argTypesRegex: "^on[A-Z].*" },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
      },
    },
  },

  decorators: [
    (Story) => {
      return (
        <Providers>
          <Story />
        </Providers>
      );
    },
  ],
};

export default preview;
