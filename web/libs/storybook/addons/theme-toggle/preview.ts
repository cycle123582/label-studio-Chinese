import { PARAM_KEY } from "./constants";

// Watch localStorage for changes to the theme
// and update the theme in the Storybook preview
window.addEventListener("storage", (event) => {
  if (event.key === PARAM_KEY) {
    const newTheme = event.newValue ? JSON.parse(event.newValue) : "auto";
    const evaluatedTheme =
      newTheme === "auto" ? (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light") : newTheme;

    document.documentElement.setAttribute("data-color-scheme", evaluatedTheme);
  }
});
