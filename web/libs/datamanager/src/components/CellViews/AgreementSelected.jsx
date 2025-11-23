import { useSDK } from "../../providers/SDKProvider";
import { isDefined } from "../../utils/utils";
import { useState, useEffect } from "react";
import { Tooltip } from "@humansignal/ui";
import { IconInfoOutline } from "@humansignal/icons";
import { useTranslation } from "react-i18next"; // 1. 引入翻译钩子

const LOW_AGREEMENT_SCORE = 33;
const MEDIUM_AGREEMENT_SCORE = 66;

export const agreementScoreTextColor = (percentage) => {
  if (!isDefined(percentage)) return "text-neutral-content";
  if (percentage < LOW_AGREEMENT_SCORE) return "text-negative-content";
  if (percentage < MEDIUM_AGREEMENT_SCORE) return "text-warning-content";

  return "text-positive-content";
};

const formatNumber = (num) => {
  const number = Number(num);

  if (num % 1 === 0) {
    return number;
  }
  return number.toFixed(2);
};

export const AgreementSelected = (cell) => {
  const { t } = useTranslation(); // 2. 初始化翻译
  const { value, original: task } = cell;

  const threshold = window.APP_SETTINGS?.agreement_selected_threshold;
  const overThreshold = Number(task?.total_annotations) > Number(threshold);

  // 3. 使用 t() 函数替换硬编码的英文，并传入 threshold 参数
  const content = overThreshold ? (
    <Tooltip
      title={t(
        "agreement.threshold_tooltip",
        { threshold, defaultValue: `Agreement (Selected) is not computed for tasks with more than ${threshold} annotations` }
      )}
    >
      <span className="inline-flex items-center text-neutral-content-subtler">
        <IconInfoOutline />
      </span>
    </Tooltip>
  ) : (
    <span className={agreementScoreTextColor(value)}>{isDefined(value) ? `${formatNumber(value)}%` : ""}</span>
  );

  return <div className="flex items-center">{content}</div>;
};

AgreementSelected.userSelectable = false;

AgreementSelected.HeaderCell = ({ agreementFilters, onSave, onClose }) => {
  const sdk = useSDK();
  const [content, setContent] = useState(null);

  useEffect(() => {
    // 注意：这里的 SDK 调用返回的内容通常是在 Label Studio 企业版插件内部渲染的
    // 如果 Header 弹出的内容是英文，那需要在 SDK 对应的插件代码中进行汉化，无法在这个文件中修改
    sdk.invoke("AgreementSelectedHeaderClick", { agreementFilters, onSave, onClose }, (jsx) => setContent(jsx));
  }, []);

  return content;
};

AgreementSelected.style = {
  minWidth: 210,
};
