import { default as frames } from "./Frames";

const Views = {
  frames,
};

export type ViewTypes = keyof typeof Views;
export type ViewType<T extends ViewTypes> = (typeof Views)[T];

export default Views;
