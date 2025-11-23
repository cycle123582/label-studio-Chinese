import { FilterDropdown } from "../FilterDropdown";
import { useTranslation } from "react-i18next"; // 1. 引入翻译钩子

export const Common = [
  {
    key: "empty",
    label: "is empty", // 这个 label 会被 FilterOperation.jsx 中的翻译逻辑覆盖
    input: (props) => {
      const { t } = useTranslation(); // 2. 初始化翻译

      return (
        <FilterDropdown
          value={props.value ?? false}
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
