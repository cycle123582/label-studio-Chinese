// 假设您的翻译函数可以这样引入
import i18next from "i18next";
const t = i18next.t; // <-- 这只是一个示例，请根据您的项目结构进行调整

import { z } from "zod";
import type { ProviderConfig } from "@humansignal/app-common/blocks/StorageProviderForm/types/provider";
import { IconCloudProviderRedis } from "@humansignal/icons";

export const redisProvider: ProviderConfig = {
  name: "redis",
  // 使用 t 函数进行翻译
  title: t("storage_settings.providers.redis.title"),
  description: t("storage_settings.providers.redis.description"),
  icon: IconCloudProviderRedis,
  fields: [
    {
      name: "db",
      type: "text",
      // 使用 t 函数进行翻译
      label: t("storage_settings.providers.redis.fields.db.label"),
      placeholder: "1",
      schema: z.string().default("1"),
    },
    {
      name: "password",
      type: "password",
      // 使用 t 函数进行翻译
      label: t("storage_settings.providers.redis.fields.password.label"),
      autoComplete: "new-password",
      // 使用 t 函数进行翻译
      placeholder: t("storage_settings.providers.redis.fields.password.placeholder"),
      schema: z.string().optional().default(""),
    },
    {
      name: "host",
      type: "text",
      // 使用 t 函数进行翻译
      label: t("storage_settings.providers.redis.fields.host.label"),
      required: true,
      // 使用 t 函数进行翻译
      placeholder: t("storage_settings.providers.redis.fields.host.placeholder"),
      // 使用 t 函数翻译 Zod 验证信息
      schema: z.string().min(1, t("storage_settings.providers.redis.validation.host_required")),
    },
    {
      name: "port",
      type: "text",
      // 使用 t 函数进行翻译
      label: t("storage_settings.providers.redis.fields.port.label"),
      placeholder: "6379",
      schema: z.string().default("6379"),
    },
    {
      name: "prefix",
      type: "text",
      // 使用 t 函数进行翻译
      label: t("storage_settings.providers.redis.fields.prefix.label"),
      // 使用 t 函数进行翻译
      placeholder: t("storage_settings.providers.redis.fields.prefix.placeholder"),
      schema: z.string().optional().default(""),
      target: "export",
    },
  ],
  layout: [{ fields: ["host", "port", "db", "password"] }, { fields: ["prefix"] }],
};

export default redisProvider;
