import React from "react";

import { useStorybookApi } from "storybook/manager-api";
import { IconButton } from "storybook/internal/components";
import { MoonIcon, SunIcon } from "@storybook/icons";

import { ADDON_ID, TOOL_ID, THEMES, DEFAULT_THEME } from "./constants";
import { useAtom, useAtomValue } from "jotai/react";
import { evaluatedThemeAtom, themeAtom } from "./atoms";

export const ThemeTool = React.memo(function MyAddonSelector() {
  const [theme, setTheme] = useAtom(themeAtom);
  const evaluatedTheme = useAtomValue(evaluatedThemeAtom);
  const api = useStorybookApi();

  const toggleTheme = React.useCallback(() => {
    setTheme((previousTheme) => THEMES[(THEMES.indexOf(previousTheme) + 1) % THEMES.length]);
  }, []);

  React.useEffect(() => {
    api.setAddonShortcut(ADDON_ID, {
      label: "Toggle Theme [8]",
      defaultShortcut: ["8"],
      actionName: "toggleTheme",
      showInMenu: false,
      action: toggleTheme,
    });
  }, [toggleTheme, api]);

  return (
    <IconButton
      style={{ height: "28px", width: "28px" }}
      key={TOOL_ID}
      active={theme !== DEFAULT_THEME}
      title="Toggle theme"
      onClick={toggleTheme}
    >
      {theme === DEFAULT_THEME ? (
        <div style={{ position: "relative" }}>
          {evaluatedTheme === "light" ? (
            <>
              <SunIcon style={{ top: "50%", left: "50%", position: "absolute", transform: "translate(-50%, -50%)" }} />
              <MoonIcon
                style={{
                  height: "8px",
                  width: "8px",
                  opacity: "0.5",
                  top: "50%",
                  left: "50%",
                  position: "absolute",
                  transform: "translate(80%, -120%)",
                }}
              />
            </>
          ) : (
            <>
              <MoonIcon style={{ top: "50%", left: "50%", position: "absolute", transform: "translate(-50%, -50%)" }} />
              <SunIcon
                style={{
                  height: "10px",
                  width: "10px",
                  opacity: "0.5",
                  top: "50%",
                  left: "50%",
                  position: "absolute",
                  transform: "translate(40%, -100%)",
                }}
              />
            </>
          )}
        </div>
      ) : evaluatedTheme === "dark" ? (
        <MoonIcon />
      ) : (
        <SunIcon />
      )}
    </IconButton>
  );
});
