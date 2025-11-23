import { global } from "@storybook/global";
import { atomWithStorage } from "jotai/utils";
import { atom } from "jotai/vanilla";
import { PARAM_KEY } from "./constants";

export const themeAtom = atomWithStorage(PARAM_KEY, "auto");
export const evaluatedThemeAtom = atom((get) => {
  let theme = get(themeAtom);

  if (theme === "auto") {
    theme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  }

  global.document.documentElement.setAttribute("data-color-scheme", theme);

  return theme;
});

(evaluatedThemeAtom as any).onMount = (get: any, set: (a: any, v: any) => void) => {
  const mediaQueryList = window.matchMedia("(prefers-color-scheme: dark)");
  const callback = (event: MediaQueryListEvent) => {
    const theme = get(themeAtom);
    const evaluatedTheme = theme === "auto" ? (event.matches ? "dark" : "light") : theme;
    if (theme === "auto") {
      set(evaluatedThemeAtom, evaluatedTheme);
    }
    global.document.documentElement.setAttribute("data-color-scheme", evaluatedTheme);
  };
  mediaQueryList.addEventListener("change", callback);
  return () => {
    mediaQueryList.removeEventListener("change", callback);
  };
};
