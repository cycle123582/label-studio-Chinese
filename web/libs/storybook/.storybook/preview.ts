import "@humansignal/ui/tailwind.css";
import "./preview.scss";
import "../addons/theme-toggle/preview";
import type { Preview } from "@storybook/react";

const preview: Preview = {
  // ...rest of preview
  //👇 Enables auto-generated documentation for all stories
  tags: ["autodocs"],
};

export default preview;
