import { Button } from "@humansignal/ui";
import { cn } from "apps/labelstudio/src/utils/bem";
import type { FC } from "react";
import "./EmptyList.scss";
import { HeidiAi } from "apps/labelstudio/src/assets/images";
import { useTranslation } from "react-i18next"; // 1. 引入翻译 Hook

export const EmptyList: FC = () => {
  const { t } = useTranslation(); // 2. 初始化翻译

  return (
    <div className={cn("empty-models-list").toClassName()}>
      <div className={cn("empty-models-list").elem("content").toClassName()}>
        <div className={cn("empty-models-list").elem("heidy").toClassName()}>
          <HeidiAi />
        </div>

        {/* 3. 汉化标题 */}
        <div className={cn("empty-models-list").elem("title").toClassName()}>
          {t("models.create_model", "Create a Model")}
        </div>

        {/* 4. 汉化描述文案 */}
        <div className={cn("empty-models-list").elem("caption").toClassName()}>
          {t("models.empty_desc", "Build a high quality model to auto-label your data using LLMs")}
        </div>

        {/* 5. 汉化按钮及 Aria Label */}
        <Button aria-label={t("models.create_new_model_aria", "Create new model")}>
          {t("models.create_model", "Create a Model")}
        </Button>
      </div>
    </div>
  );
};
