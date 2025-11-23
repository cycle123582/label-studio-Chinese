// 假设您的翻译函数可以这样引入
import i18next from "i18next";
const t = i18next.t; // <-- 请根据您的项目结构进行调整

import type { ProviderConfig } from "@humansignal/app-common/blocks/StorageProviderForm/types/provider";
import { IconCloudProviderAzure } from "@humansignal/icons";
import { z } from "zod";

export const azureProvider: ProviderConfig = {
  name: "azure",
  // 使用 t 函数进行翻译
  title: t("storage_settings.providers.azure.title"),
  description: t("storage_settings.providers.azure.description"),
  icon: IconCloudProviderAzure,
  fields: [
    {
      name: "container",
      type: "text",
      // 使用 t 函数进行翻译
      label: t("storage_settings.providers.azure.fields.container.label"),
      required: true,
      // 使用 t 函数进行翻译
      placeholder: t("storage_settings.providers.azure.fields.container.placeholder"),
      // 使用 t 函数翻译验证信息
      schema: z.string().min(1, t("storage_settings.providers.azure.validation.container_required")),
    },
    {
      name: "prefix",
      type: "text",
      // 使用 t 函数进行翻译
      label: t("storage_settings.providers.azure.fields.prefix.label"),
      // 使用 t 函数进行翻译
      placeholder: t("storage_settings.providers.azure.fields.prefix.placeholder"),
      schema: z.string().optional().default(""),
      target: "export",
    },
    {
      name: "account_name",
      type: "password",
      // 使用 t 函数进行翻译
      label: t("storage_settings.providers.azure.fields.account_name.label"),
      autoComplete: "off",
      accessKey: true,
      // 使用 t 函数进行翻译
      placeholder: t("storage_settings.providers.azure.fields.account_name.placeholder"),
      schema: z.string().optional().default(""),
    },
    {
      name: "account_key",
      type: "password",
      // 使用 t 函数进行翻译
      label: t("storage_settings.providers.azure.fields.account_key.label"),
      autoComplete: "new-password",
      accessKey: true,
      // 使用 t 函数进行翻译
      placeholder: t("storage_settings.providers.azure.fields.account_key.placeholder"),
      schema: z.string().optional().default(""),
    },
    {
      name: "presign",
      type: "toggle",
      // 使用 t 函数进行翻译
      label: t("storage_settings.providers.azure.fields.presign.label"),
      description: t("storage_settings.providers.azure.fields.presign.description"),
      schema: z.boolean().default(true),
      target: "import",
      resetConnection: false,
    },
    {
      name: "presign_ttl",
      type: "counter",
      // 使用 t 函数进行翻译
      label: t("storage_settings.providers.azure.fields.presign_ttl.label"),
      min: 1,
      max: 10080,
      step: 1,
      schema: z.number().min(1).max(10080).default(15),
      target: "import",
      resetConnection: false,
      dependsOn: {
        field: "presign",
        value: true,
      },
    },
  ],
  layout: [
    { fields: ["container"] },
    { fields: ["prefix"] },
    { fields: ["account_name"] },
    { fields: ["account_key"] },
    { fields: ["presign", "presign_ttl"] },
  ],
};

export default azureProvider;
