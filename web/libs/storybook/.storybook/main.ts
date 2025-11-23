import type { StorybookConfig } from "@storybook/react-webpack5";

const config: StorybookConfig = {
  stories: ["../../../libs/**/*.@(mdx|stories.@(js|jsx|ts|tsx))", "../../../apps/**/*.@(mdx|stories.@(js|jsx|ts|tsx))"],

  addons: ["@nx/react/plugins/storybook", "@storybook/addon-docs", "../addons/theme-toggle/register"],

  webpackFinal(config) {
    const rules = config.module?.rules ?? [];

    for (const rule of rules) {
      if (!rule || typeof rule === "string") continue;

      const testString = rule.test?.toString() ?? "";
      const isCss = testString.includes("\\.css");

      if (isCss) {
        rule.exclude = /tailwind\.css/;
      }
    }
    return {
      ...config,
      module: {
        ...(config.module ?? {}),
        rules: [
          {
            test: /tailwind\.css/,
            exclude: /node_modules/,
            use: [
              "style-loader",
              {
                loader: "css-loader",
                options: {
                  importLoaders: 1,
                },
              },
              "postcss-loader",
            ],
          },

          ...(config.module?.rules ?? []),
        ],
      },
    };
  },

  framework: "@storybook/react-webpack5",

  typescript: {
    reactDocgen: "react-docgen",
  },
};

export default config;

// To customize your webpack configuration you can use the webpackFinal field.
// Check https://storybook.js.org/docs/react/builders/webpack#extending-storybooks-webpack-config
// and https://nx.dev/recipes/storybook/custom-builder-configs
