import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Smart merge class names
 */
export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

/**
 * Merge class names + merge optimize Tailwind classes
 */
export function cnm(...input: ClassValue[]) {
  return twMerge(cn(input));
}
