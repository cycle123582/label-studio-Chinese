import { observer } from "mobx-react";
import { getRoot } from "mobx-state-tree";
import { useCallback, useMemo } from "react";
import { cn } from "../../../utils/bem";
import { debounce } from "../../../utils/debounce";
import { FilterDropdown } from "../FilterDropdown";
import * as FilterInputs from "../types";
import { allowedFilterOperations } from "../types/Utility";
import { Common } from "../types/Common";
import { useTranslation } from "react-i18next"; // 1. 引入翻译钩子

/** @typedef {{
 * type: keyof typeof FilterInputs,
 * width: number
 * }} FieldConfig */

/**
 *
 * @param {{field: FieldConfig}} param0
 */
export const FilterOperation = observer(({ filter, field, operator, value, disabled }) => {
  const { t } = useTranslation(); // 2. 初始化翻译
  const cellView = filter.cellView;
  const types = cellView?.customOperators ?? [
    ...(FilterInputs[filter.filter.currentType] ?? FilterInputs.String),
    ...Common,
  ];

  const selected = useMemo(() => {
    let result;

    if (operator) {
      result = types.find((t) => t.key === operator);
    }

    if (!result) {
      result = types[0];
    }

    filter.setOperator(result.key);
    return result;
  }, [operator, types, filter]);

  const saveFilter = useCallback(
    debounce(() => {
      filter.save(true);
    }, 300),
    [filter],
  );

  const onChange = (newValue) => {
    filter.setValue(newValue);
    saveFilter();
  };

  const onOperatorSelected = (selectedKey) => {
    filter.setOperator(selectedKey);
  };
  const availableOperators = filter.cellView?.filterOperators;
  const Input = selected?.input;
  let operatorList = allowedFilterOperations(types, getRoot(filter)?.SDK?.type);
  if (filter.filter.field.isAnnotationResultsFilterColumn) {
    // We want at most one of "equal" or "contains" per filter type
    // They resolve to the same backend query in this custom case
    const hasEqualOperators = operatorList.some((o) => ["equal", "not_equal"].includes(o.key));
    const allowedOperators = hasEqualOperators ? ["equal", "not_equal"] : ["contains", "not_contains"];
    operatorList = operatorList.filter((op) => allowedOperators.includes(op.key));
  }

  // 3. 汉化操作符逻辑
  const operators = operatorList.map(({ key, label }) => {
    // 默认尝试翻译通用 key (如 'equal', 'contains')
    let translatedLabel = t(`filters.operators.${key}`, label);

    if (filter.filter.field.isAnnotationResultsFilterColumn) {
      if (filter.schema?.multiple ?? false) {
        if (key === "contains") translatedLabel = t("filters.operators.includes_all", "includes all");
        if (key === "not_contains") translatedLabel = t("filters.operators.does_not_include_all", "does not include all");
      } else {
        if (key === "contains") translatedLabel = t("filters.operators.is", "is");
        if (key === "not_contains") translatedLabel = t("filters.operators.is_not", "is not");
      }
    }
    return { value: key, label: translatedLabel };
  });

  const columnClass = cn("filterLine").elem("column");

  return Input ? (
    <>
      <div className={columnClass.mix("operation").toString()}>
        <FilterDropdown
          placeholder={t("filters.condition", "Condition")} // 4. 汉化 Condition
          value={filter.operator}
          disabled={types.length === 1 || disabled}
          items={availableOperators ? operators.filter((op) => availableOperators.includes(op.value)) : operators}
          onChange={onOperatorSelected}
        />
      </div>
      <div className={columnClass.mix("value").toString()}>
        <Input
          {...field}
          key={`${filter.filter.id}-${filter.filter.currentType}`}
          schema={filter.schema}
          filter={filter}
          multiple={filter.schema?.multiple ?? false}
          value={value}
          onChange={onChange}
          size="small"
          disabled={disabled}
        />
      </div>
    </>
  ) : null;
});
