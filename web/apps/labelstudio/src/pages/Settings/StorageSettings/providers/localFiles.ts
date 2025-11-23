// 假设您的翻译函数可以这样引入
import i18next from "i18next";
const t = i18next.t; // <-- 请根据您的项目结构进行调整

import { z } from "zod";
import type { ProviderConfig } from "@humansignal/app-common/blocks/StorageProviderForm/types/provider";
import { IconDocument } from "@humansignal/icons";

export const localFilesProvider: ProviderConfig = {
  name: "localfiles",
  // 使用 t 函数进行翻译
  title: t("storage_settings.providers.localfiles.title"),
  description: t("storage_settings.providers.localfiles.description"),
  icon: IconDocument,
  fields: [
    {
      name: "path",
      type: "text",
      // 使用 t 函数进行翻译
      label: t("storage_settings.providers.localfiles.fields.path.label"),
      required: true,
      // 使用 t 函数进行翻译
      placeholder: t("storage_settings.providers.localfiles.fields.path.placeholder"),
      // 使用 t 函数翻译验证信息
      schema: z.string().min(1, t("storage_settings.providers.localfiles.validation.path_required")),
    },
    {
      name: "prefix",
      type: "text",
      // 使用 t 函数进行翻译
      label: t("storage_settings.providers.localfiles.fields.prefix.label"),
      // 使用 t 函数进行翻译
      placeholder: t("storage_settings.providers.localfiles.fields.prefix.placeholder"),
      schema: z.string().optional().default(""),
      target: "export",
    },
  ],
  layout: [{ fields: ["path"] }, { fields: ["prefix"] }],
};

export default localFilesProvider;
