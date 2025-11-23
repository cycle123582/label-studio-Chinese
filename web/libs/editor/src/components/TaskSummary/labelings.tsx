import { cnm } from "@humansignal/ui";
import type { RawResult } from "../../stores/types";
import type { RendererType } from "./types";
import { getLabelCounts } from "./utils";

const resultValue = (result: RawResult) => {
  if (result.type === "textarea") {
    return result.value.text;
  }

  return result.value[result.type];
};

const LabelingChip = ({ children }: { children: string | number }) => {
  return (
    <span
      className={cnm(
        "inline-block whitespace-nowrap rounded-4 px-2",
        "bg-primary-background border border-primary-emphasis text-accent-grape-dark",
      )}
    >
      {children}
    </span>
  );
};

const LabelsRenderer: RendererType = (results, control) => {
  const labels = results.flatMap(resultValue).flat();

  if (!labels.length) return "-";

  const labelCounts = getLabelCounts(labels, control.label_attrs);

  return (
    <span className="flex gap-2 flex-wrap">
      {Object.entries(labelCounts)
        .filter(([_, data]) => data.count > 0)
        .map(([label, data]) => {
          return (
            <span
              key={label}
              className="inline-block px-2 whitespace-nowrap rounded-4"
              style={{
                borderLeft: `4px solid ${data.border}`,
                color: data.color,
                background: data.background,
              }}
            >
              <b>{data.count}</b> {label}
            </span>
          );
        })}
    </span>
  );
};

export const renderers: Record<string, RendererType> = {
  labels: LabelsRenderer,
  ellipselabels: LabelsRenderer,
  polygonlabels: LabelsRenderer,
  vectorlabels: LabelsRenderer,
  rectanglelabels: LabelsRenderer,
  keypointlabels: LabelsRenderer,
  brushlabels: LabelsRenderer,
  hypertextlabels: LabelsRenderer,
  timeserieslabels: LabelsRenderer,
  paragraphlabels: LabelsRenderer,
  timelinelabels: LabelsRenderer,
  bitmasklabels: LabelsRenderer,
  datetime: (results, control) => {
    if (!results.length) return "-";
    if (control.per_region) return null;

    return resultValue(results[0]);
  },
  number: (results, control) => {
    if (!results.length) return "-";
    if (control.per_region) return null;

    return resultValue(results[0]);
  },
  choices: (results) => {
    const choices = results.flatMap(resultValue).flat();
    const unique: string[] = [...new Set(choices)];

    if (!choices.length) return null;

    return (
      <span className="flex gap-2 flex-wrap">
        {unique.map((choice) => (
          <LabelingChip key={choice}>{choice}</LabelingChip>
        ))}
      </span>
    );
  },
  taxonomy: (results, control) => {
    if (!results.length) return "-";
    if (control.per_region) return null;

    // @todo use `pathseparator` from control
    const values: string[] = resultValue(results[0]).map((item: string[]) => item.join(" / "));

    return (
      <span className="flex gap-2 flex-wrap">
        {values.map((value) => (
          <LabelingChip key={value}>{value}</LabelingChip>
        ))}
      </span>
    );
  },
  textarea: (results, control) => {
    if (!results.length) return "-";
    if (control.per_region) return null;

    const texts: string[] = resultValue(results[0]);

    if (!texts) return null;

    // biome-ignore lint/suspicious/noArrayIndexKey: this piece won't be rerendered with updated data anyway and texts can be huge
    return (
      <div className="text-ellipsis line-clamp-6">
        {texts.map((text, i) => (
          <p key={i}>{text}</p>
        ))}
      </div>
    );
  },
  ranker: (results) => {
    if (!results.length) return "-";

    const value: Record<string, number[]> = resultValue(results[0]);

    return Object.entries(value).map(([bucket, items]) => {
      return (
        <p key={bucket}>
          <b>{bucket}</b>:{" "}
          <span className="inline-flex gap-2 flex-wrap">
            {items.map((item) => (
              <LabelingChip key={item}>{item}</LabelingChip>
            ))}
          </span>
        </p>
      );
    });
  },
  rating: (results, control) => {
    if (!results.length) return "-";
    if (control.per_region) return null;

    const value = resultValue(results[0]);

    if (!value) return null;

    return "★".repeat(value);
  },
};
