// Color tokens from Figma
const colorTokens = {
  grape: {
    base: "var(--color-accent-grape-base)",
  },
  blueberry: {
    base: "var(--color-accent-blueberry-base)",
  },
  kale: {
    base: "var(--color-accent-kale-base)",
  },
  kiwi: {
    base: "var(--color-accent-kiwi-base)",
  },
  mango: {
    base: "var(--color-accent-mango-base)",
  },
  canteloupe: {
    base: "var(--color-accent-canteloupe-base)",
  },
  persimmon: {
    base: "var(--color-accent-persimmon-base)",
  },
  plum: {
    base: "var(--color-accent-plum-base)",
  },
  fig: {
    base: "var(--color-accent-fig-base)",
  },
  sand: {
    bold: "var(--color-accent-sand-bold)",
  },
};

// Order of colors for optimal contrast
const colorOrder = ["grape", "mango", "kale", "persimmon", "sand", "kiwi", "canteloupe", "fig", "plum", "blueberry"];

/**
 * Get a color for a channel based on its index
 * @param {number} index - Index of the channel
 * @returns {string} - CSS variable for the color
 */
export const getChannelColor = (index) => {
  const colorName = colorOrder[index % colorOrder.length];
  return colorTokens[colorName][colorName === "sand" ? "bold" : "base"];
};
