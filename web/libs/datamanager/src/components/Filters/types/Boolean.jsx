import { FilterDropdown } from "../FilterDropdown";
import { useTranslation } from "react-i18next"; // 1. 引入翻译钩子

export const BooleanFilter = [
  {
    key: "equal",
    label: "is", // 注意：这里的 label 显示通常由 FilterOperation.jsx 根据 key='equal' 进行统一翻译（即“等于”），所以此处不需要硬改
    valueType: "single",
    input: (props) => {
      const { t } = useTranslation(); // 2. 初始化翻译

      return (
        <FilterDropdown
          defaultValue={props.value ?? false}
          onChange={(value) => props.onChange(value)}
          items={[
            // 3. 汉化选项
            { value: true, label: t("common.yes", "yes") },
            { value: false, label: t("common.no", "no") },
          ]}
          disabled={props.disabled}
        />
      );
    },
  },
];
