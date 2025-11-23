import type { ReactNode } from "react";
import type { MSTObjectTag, MSTTagImage, RawResult } from "../../stores/types";

export type LabelColors = {
  value: string;
  border: string;
  color?: string;
  background: string;
};

export type LabelCounts = LabelColors & {
  count: number;
};

export type ControlTag = {
  name: string;
  type: string;
  to_name: string;
  label_attrs: Record<string, LabelColors>;
  per_region: boolean;
};

export type AnnotationSummary = {
  id: string;
  type: "annotation" | "prediction";
  results: RawResult[];
  createdBy: string;
  user: any;
};

export type ObjectTagEntry = [string, MSTObjectTag | MSTTagImage];
export type ObjectTypes = Record<string, { type: string; value: any }>;

export type RendererType = (results: RawResult[], control: ControlTag) => ReactNode;
