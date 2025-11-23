// 假设您的翻译函数可以这样引入
import i18next from "i18next";
const t = i18next.t; // <-- 请根据您的项目结构进行调整

import { z } from "zod";
import type { ProviderConfig } from "@humansignal/app-common/blocks/StorageProviderForm/types/provider";
import { IconCloudProviderGCS } from "@humansignal/icons";

export const gcsProvider: ProviderConfig = {
  name: "gcs",
  // 使用 t 函数进行翻译
  title: t("storage_settings.providers.gcs.title"),
  description: t("storage_settings.providers.gcs.description"),
  icon: IconCloudProviderGCS,
  fields: [
    {
      name: "bucket",
      type: "text",
      // 使用 t 函数进行翻译
      label: t("storage_settings.providers.gcs.fields.bucket.label"),
      required: true,
      // 使用 t 函数翻译验证消息
      schema: z.string().min(1, t("storage_settings.providers.gcs.validation.bucket_required")),
    },
    {
      name: "prefix",
      type: "text",
      // 使用 t 函数进行翻译
      label: t("storage_settings.providers.gcs.fields.prefix.label"),
      // 使用 t 函数进行翻译
      placeholder: t("storage_settings.providers.gcs.fields.prefix.placeholder"),
      schema: z.string().optional().default(""),
      target: "export",
    },
    {
      name: "google_application_credentials",
      type: "password",
      // 使用 t 函数进行翻译
      label: t("storage_settings.providers.gcs.fields.google_application_credentials.label"),
      description: t("storage_settings.providers.gcs.fields.google_application_credentials.description"),
      autoComplete: "new-password",
      accessKey: true,
      schema: z.string().optional().default(""), // JSON validation could be added if needed
    },
    {
      name: "google_project_id",
      type: "text",
      // 使用 t 函数进行翻译
      label: t("storage_settings.providers.gcs.fields.google_project_id.label"),
      description: t("storage_settings.providers.gcs.fields.google_project_id.description"),
      schema: z.string().optional().default(""),
    },
    {
      name: "presign",
      type: "toggle",
      // 使用 t 函数进行翻译
      label: t("storage_settings.providers.gcs.fields.presign.label"),
      description: t("storage_settings.providers.gcs.fields.presign.description"),
      schema: z.boolean().default(true),
      target: "import",
      resetConnection: false,
    },
    {
      name: "presign_ttl",
      type: "counter",
      // 使用 t 函数进行翻译
      label: t("storage_settings.providers.gcs.fields.presign_ttl.label"),
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
    { fields: ["bucket"] },
    { fields: ["prefix"] },
    { fields: ["google_application_credentials"] },
    { fields: ["google_project_id"] },
    { fields: ["presign", "presign_ttl"] },
  ],
};

export default gcsProvider;
