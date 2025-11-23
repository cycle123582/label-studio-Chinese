import { atom } from "jotai";
import { getQueryParams } from "../utils/query";

export const defaultConfig = "<View>\n  <!-- Paste your XML config here -->\n</View>";

export const configAtom = atom<string>(defaultConfig);
export const loadingAtom = atom<boolean>(false);
export const errorAtom = atom<string | null>(null);
export const interfacesAtom = atom<string[]>([]);
export const showPreviewAtom = atom<boolean>(true);
export const sampleTaskAtom = atom<any>({});
export const annotationAtom = atom<any>([]);
export const modeAtom = atom<"preview" | "editor" | "">("editor");
export const displayModeAtom = atom<"preview" | "preview-inline" | "all">(() => {
  const params = getQueryParams();
  const mode = params.get("mode");
  if (mode === "preview") return "preview";
  if (mode === "preview-inline") return "preview-inline";
  return "all";
});
