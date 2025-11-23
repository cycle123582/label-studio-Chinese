import { Button } from "@humansignal/ui";
import { IconCross } from "@humansignal/icons";
// 1. 引入翻译钩子
import { useTranslation } from "react-i18next";

interface FormHeaderProps {
  title?: string;
  onClose: () => void;
}

export const FormHeader = ({ title, onClose }: FormHeaderProps) => {
  // 2. 初始化翻译函数
  const { t } = useTranslation();

  return (
    <div className="flex justify-between items-start px-wide py-base pt-wide">
      <div>
        {/* 这里的 title 是父组件传进来的，如果它是英文，说明父组件传参时还没翻译 */}
        <h2 className="m-0 mb-tight text-headline-large font-medium text-neutral-content">{title}</h2>
        <div className="text-body-medium text-neutral-content-subtle leading-relaxed">
          {/* 3. 替换硬编码的英文 */}
          {t("storage_settings.import_from_cloud")}
        </div>
      </div>
      <Button leading={<IconCross />} look="string" onClick={onClose} />
    </div>
  );
};
