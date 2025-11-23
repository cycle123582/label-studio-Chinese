import { observer } from "mobx-react";
import { Select, Badge } from "@humansignal/ui";
import { stateLabels, STATE_COLORS, colorToClasses } from "../../CellViews/TaskState";
import { useMemo } from "react";
import { useTranslation } from "react-i18next"; // 1. 引入翻译钩子

const BaseInput = observer(({ value, onChange, placeholder }) => {
  const { t } = useTranslation(); // 2. 初始化翻译

  const options = useMemo(() => {
    return Object.keys(stateLabels).map((key) => {
      // 3. 这里是关键：使用 key (如 CREATED) 去翻译文件中查找对应的中文
      // stateLabels[key] 作为后备（fallback），如果没找到中文则显示英文
      const textLabel = t(`task_states.${key}`, stateLabels[key]);

      const color = STATE_COLORS[key] || "grey";
      const colorClasses = colorToClasses[color];

      return {
        value: key,
        textLabel, // 这里现在是中文了
        label: <Badge className={colorClasses}>{textLabel}</Badge>,
      };
    });
  }, [t]); // 将 t 加入依赖数组，支持语言热切换

  return (
    <Select
      options={options}
      value={value}
      onChange={onChange}
      // 4. 汉化占位符
      placeholder={placeholder ?? t("filters.select_value", "Select value")}
      searchable={true}
      onSearch={(value) => {
        // 搜索逻辑现在会匹配中文文本
        return options.filter((option) => option.textLabel.toLowerCase().includes(value.toLowerCase()));
      }}
      selectedValueRenderer={(option) => {
        if (!option) return null;

        const color = STATE_COLORS[option.value] || "grey";
        const colorClasses = colorToClasses[color];

        return <Badge className={`${colorClasses} h-[18px] text-[12px]`}>{option.textLabel}</Badge>;
      }}
      size="small"
      triggerClassName="min-w-[100px]"
    />
  );
});

export const TaskStateFilter = [
  {
    key: "contains",
    label: "contains", // 不需要改，FilterOperation.jsx 会根据 key 自动翻译
    valueType: "list",
    input: (props) => <BaseInput {...props} />,
  },
  {
    key: "not_contains",
    label: "not contains", // 不需要改
    valueType: "list",
    input: (props) => <BaseInput {...props} />,
  },
];
