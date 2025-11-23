import { addons, types } from "storybook/manager-api";
import { ADDON_ID, TOOL_ID } from "./constants";
import { ThemeTool } from "./theme-toggle";

addons.register(ADDON_ID, () => {
  addons.add(TOOL_ID, {
    type: types.TOOL,
    title: "Toggle Theme",
    match: ({ tabId, viewMode }: any) => !tabId && (viewMode === "story" || viewMode === "docs"),
    render: ThemeTool,
  } as any);
});
