import camelCase from "lodash/camelCase";

/**
 * Convert string to PascalCase (StudlyCase)
 * This is essentially camelCase with the first letter capitalized
 * This is the only utility we need since lodash doesn't provide PascalCase
 */
export const toStudlyCaps = (str: string): string => {
  const camelCased = camelCase(str);
  return camelCased.charAt(0).toUpperCase() + camelCased.slice(1);
};
