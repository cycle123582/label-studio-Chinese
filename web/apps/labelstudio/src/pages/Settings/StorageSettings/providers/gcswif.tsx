// 假设您的翻译函数可以这样引入
import i18next from "i18next";
const t = i18next.t; // <-- 请根据您的项目结构进行调整

import { EnterpriseBadge, IconSpark } from "@humansignal/ui";
import { Alert, AlertTitle, AlertDescription } from "@humansignal/shad/components/ui/alert";
import { IconCloudProviderGCS } from "@humansignal/icons";
import type { ProviderConfig } from "@humansignal/app-common/blocks/StorageProviderForm/types/provider";

const gcsWifProvider: ProviderConfig = {
  name: "gcswif",
  // 使用 t 函数进行翻译
  title: t("storage_settings.providers.gcswif.title"),
  description: t("storage_settings.providers.gcswif.description"),
  icon: IconCloudProviderGCS,
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
          <AlertTitle>{t("storage_settings.providers.gcswif.enterprise_title")}</AlertTitle>
          <AlertDescription>
            {/* 使用 t 函数进行翻译 */}
            {t("storage_settings.providers.gcswif.enterprise_description")}{" "}
            <a
              href="https://docs.humansignal.com/guide/storage.html#Google-Cloud-Storage-with-Workload-Identity-Federation-WIF"
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:no-underline"
            >
              {/* 复用 common.learn_more */}
              {t("common.learn_more")}
            </a>
          </AlertDescription>
        </Alert>
      ),
    },
  ],
  layout: [{ fields: ["enterprise_info"] }],
};

export default gcsWifProvider;
