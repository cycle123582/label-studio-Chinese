import { isDefined } from "../../utils/utils";
import { Badge } from "@humansignal/ui";
import { Tooltip } from "@humansignal/ui";
import { useTranslation } from "react-i18next"; // 引入翻译钩子

// 保持这个对象导出，以防其他组件（如过滤器下拉菜单）需要使用原始映射
// 但我们主要是为了保持兼容性，实际显示会由 i18n 接管
export const stateLabels = {
  CREATED: "Created",
  ANNOTATION_IN_PROGRESS: "Annotating",
  ANNOTATION_COMPLETE: "Annotated",
  REVIEW_IN_PROGRESS: "In Review",
  REVIEW_COMPLETE: "Reviewed",
  ARBITRATION_NEEDED: "Needs Arbitration",
  ARBITRATION_IN_PROGRESS: "In Arbitration",
  ARBITRATION_COMPLETE: "Arbitrated",
  COMPLETED: "Done",
};

// 颜色映射保持不变
export const STATE_COLORS = {
  // Grey - Initial
  CREATED: "grey",

  // Blue - In Progress
  ANNOTATION_IN_PROGRESS: "blue",
  REVIEW_IN_PROGRESS: "blue",
  ARBITRATION_IN_PROGRESS: "blue",

  // Yellow - Attention/Churn
  ARBITRATION_NEEDED: "yellow",

  // Green - Complete/Terminal
  ANNOTATION_COMPLETE: "green",
  REVIEW_COMPLETE: "green",
  ARBITRATION_COMPLETE: "green",
  COMPLETED: "green",
};

// 样式类映射保持不变
export const colorToClasses = {
  grey: "bg-neutral-emphasis border-neutral-border text-neutral-content",
  blue: "bg-primary-emphasis border-primary-border-subtlest text-primary-content",
  yellow: "bg-warning-emphasis border-warning-border-subtlest text-warning-content",
  green: "bg-positive-emphasis border-positive-border-subtlest text-positive-content",
};

export const TaskState = (cell) => {
  const { t } = useTranslation(); // 初始化翻译函数
  const { value } = cell;

  if (!isDefined(value) || value === null || value === "") {
    return null;
  }

  // 使用 t() 函数获取翻译，如果找不到 key 则回退到 stateLabels 或原始 value
  const label = t(`task_states.${value}`, stateLabels[value] || value);

  // 获取描述的翻译
  const description = t(`task_state_descriptions.${value}`, value);

  const color = STATE_COLORS[value] || "grey";
  const colorClasses = colorToClasses[color];

  return (
    <div className="flex items-center">
      <Tooltip title={description}>
        <span>
          <Badge className={colorClasses}>{label}</Badge>
        </span>
      </Tooltip>
    </div>
  );
};

TaskState.userSelectable = false;

TaskState.style = {
  minWidth: 140,
};
