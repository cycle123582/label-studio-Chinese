import { observer } from "mobx-react";
import { FilterDropdown } from "../FilterDropdown";
import { useMemo } from "react";
import { useTranslation } from "react-i18next"; // 1. 引入翻译钩子
// import { Common } from "./Common";

function defaultFilterItems(items) {
  return items?.toJSON ? items.toJSON() : items;
}

export const VariantSelect = observer(({ filter, schema, onChange, multiple, value, placeholder, disabled }) => {
  const { t } = useTranslation(); // 2. 初始化翻译

  if (!schema) return <></>;
  const { items } = schema;

  const selectedValue = useMemo(() => {
    if (!multiple) {
      return Array.isArray(value) ? value[0] : value;
    }
    return Array.isArray(value) ? value : (value ?? []);
  }, [multiple, value]);
  const filterItems = filter.cellView?.filterItems || defaultFilterItems;
  const FilterItem = filter.cellView?.FilterItem;
  return (
    <FilterDropdown
      items={filterItems(items)}
      value={selectedValue}
      multiple={multiple}
      optionRender={FilterItem}
      outputFormat={
        multiple
          ? (value) => {
              return value ? [].concat(value) : [];
            }
          : undefined
      }
      searchFilter={filter.cellView?.searchFilter}
      onChange={(value) => onChange(value)}
      // 3. 汉化占位符
      placeholder={placeholder ?? t("filters.select_value", "Select value")}
      disabled={disabled}
    />
  );
});

export const ListFilter = [
  {
    key: "contains",
    label: "contains", // 不需要改，FilterOperation.jsx 会处理翻译
    valueType: "single",
    input: (props) => <VariantSelect {...props} multiple={props.schema?.multiple} />,
  },
  {
    key: "not_contains",
    label: "not contains", // 不需要改
    valueType: "single",
    input: (props) => <VariantSelect {...props} multiple={props.schema?.multiple} />,
  },
  // ... Common,
];
