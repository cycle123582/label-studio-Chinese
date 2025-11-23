import { observer } from "mobx-react";
import { isDefined } from "../../../utils/utils";
import { FilterInput } from "../FilterInput";
import { useTranslation } from "react-i18next"; // 1. 引入翻译钩子

const valueFilter = (value) => {
  if (isDefined(value)) {
    if (typeof value === "number") {
      return value;
    }
    if (typeof value === "string") {
      const cleaned = value.replace(/([^\d.,]+)/, "");
      return cleaned ? Number(cleaned) : null;
    }
    return value || null;
  }

  return null;
};

const NumberInput = observer(({ onChange, ...rest }) => {
  return <FilterInput {...rest} type="number" onChange={(value) => onChange(valueFilter(value))} />;
});

const RangeInput = observer(({ schema, value, onChange }) => {
  const { t } = useTranslation(); // 2. 初始化翻译
  const min = value?.min ?? null;
  const max = value?.max ?? null;

  const onValueChange = (newValue) => {
    onChange(newValue);
  };

  const onChangeMin = (newValue) => {
    onValueChange({ min: Number(newValue), max });
  };

  const onChangeMax = (newValue) => {
    onValueChange({ min, max: Number(newValue) });
  };

  return (
    <div className="flex w-full min-w-[100px]">
      <NumberInput
        placeholder={t("filters.min", "Min")} // 3. 汉化 Min
        value={min}
        onChange={onChangeMin}
        schema={schema}
        style={{ flex: 1 }}
      />
      <span style={{ padding: "0 10px" }}>
        {/* 4. 汉化 separator，使用 range_and 避免与逻辑词 and 冲突 */}
        {t("filters.range_and", "and")}
      </span>
      <NumberInput
        placeholder={t("filters.max", "Max")} // 5. 汉化 Max
        value={max}
        onChange={onChangeMax}
        schema={schema}
        style={{ flex: 1 }}
      />
    </div>
  );
});

export const NumberFilter = [
  {
    key: "equal",
    label: "=",
    valueType: "single",
    input: (props) => <NumberInput {...props} />,
  },
  {
    key: "not_equal",
    label: "≠",
    valueType: "single",
    input: (props) => <NumberInput {...props} />,
  },
  {
    key: "less",
    label: "<",
    valueType: "single",
    input: (props) => <NumberInput {...props} />,
  },
  {
    key: "greater",
    label: ">",
    valueType: "single",
    input: (props) => <NumberInput {...props} />,
  },
  {
    key: "less_or_equal",
    label: "≤",
    valueType: "single",
    input: (props) => <NumberInput {...props} />,
  },
  {
    key: "greater_or_equal",
    label: "≥",
    valueType: "single",
    input: (props) => <NumberInput {...props} />,
  },
  {
    key: "in",
    label: "is between", // 不需要改，FilterOperation.jsx 会处理
    valueType: "range",
    input: (props) => <RangeInput {...props} />,
  },
  {
    key: "not_in",
    label: "not between", // 不需要改
    valueType: "range",
    input: (props) => <RangeInput {...props} />,
  },
];
