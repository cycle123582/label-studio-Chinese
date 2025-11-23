import { buttonVariant, Space } from "@humansignal/ui";
import { useUpdatePageTitle } from "@humansignal/core";
import { cn } from "apps/labelstudio/src/utils/bem";
import { Link } from "react-router-dom";
import type { Page } from "../../types/Page";
import { EmptyList } from "./@components/EmptyList";
// 1. 引入翻译 Hook
import { useTranslation } from "react-i18next";

export const ModelsPage: Page = () => {
  const { t } = useTranslation(); // 2. 初始化翻译

  // 3. 汉化浏览器标签页标题
  useUpdatePageTitle(t("models.page_title", "Models"));

  return (
    <div className={cn("prompter").toClassName()}>
      <EmptyList />
    </div>
  );
};

// 4. 静态属性汉化 (直接改为中文，防止 Hook 报错)
ModelsPage.title = () => "模型";
ModelsPage.titleRaw = "模型";
ModelsPage.path = "/models";

ModelsPage.context = () => {
  // 注意：这里是静态函数，不能直接使用 useTranslation Hook
  // 为了安全起见，直接写中文 "创建模型"
  return (
    <Space size="small">
      <Link to="/prompt/settings" className={buttonVariant({ size: "small" })}>
        创建模型
      </Link>
    </Space>
  );
};
