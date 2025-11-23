// 假设您的翻译函数可以这样引入
import i18next from "i18next";
const t = i18next.t; // <-- 这只是一个示例，请根据您的项目结构进行调整

import { EnterpriseBadge, IconSpark } from "@humansignal/ui";
import { Alert, AlertTitle, AlertDescription } from "@humansignal/shad/components/ui/alert";
import { IconCloudProviderS3 } from "@humansignal/icons";
import type { ProviderConfig } from "@humansignal/app-common/blocks/StorageProviderForm/types/provider";

const s3sProvider: ProviderConfig = {
  name: "s3s",
  // 使用 t 函数进行翻译
  title: t("storage_settings.providers.s3s.title"),
  description: t("storage_settings.providers.s3s.description"),
  icon: IconCloudProviderS3,
  disabled: true,
  badge: <EnterpriseBadge />,
  fields: [
    {
      name: "enterprise_info",
      type: "message",
      content: (
        <Alert variant="gradient">
          <IconSpark />
          {/* 使用 t 函数进行翻译 */}
          <AlertTitle>{t("storage_settings.providers.s3s.enterprise_title")}</AlertTitle>
          <AlertDescription>
            {/* 使用 t 函数进行翻译 */}
            {t("storage_settings.providers.s3s.enterprise_description")}{" "}
            <a
              href="https://docs.humansignal.com/guide/storage.html#Set-up-an-S3-connection-with-IAM-role-access"
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:no-underline"
            >
              {/* 复用已有的 common.learn_more 键 */}
              {t("common.learn_more")}
            </a>
          </AlertDescription>
        </Alert>
      ),
    },
  ],
  layout: [{ fields: ["enterprise_info"] }],
};

export default s3sProvider;
