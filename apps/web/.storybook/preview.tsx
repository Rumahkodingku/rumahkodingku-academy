import type { Preview } from "@storybook/react";

import "../src/index.css";

const preview: Preview = {
  decorators: [
    (Story, context) => {
      const theme = context.globals.theme === "dark" ? "dark" : "light";

      return (
        <div className={theme === "dark" ? "dark" : undefined}>
          <div className="min-h-screen bg-canvas p-6 text-ink">
            <Story />
          </div>
        </div>
      );
    },
  ],
  globalTypes: {
    theme: {
      description: "Preview theme",
      toolbar: {
        title: "Theme",
        icon: "circlehollow",
        items: [
          { value: "light", title: "Light" },
          { value: "dark", title: "Dark" },
        ],
        dynamicTitle: true,
      },
    },
  },
  initialGlobals: {
    theme: "light",
  },
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    layout: "fullscreen",
  },
};

export default preview;
