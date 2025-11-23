// 假设您的翻译函数可以这样引入
import i18next from "i18next";
const t = i18next.t; // <-- 这只是一个示例，请根据您的项目结构进行调整

import { z } from "zod";
import type { ProviderConfig } from "@humansignal/app-common/blocks/StorageProviderForm/types/provider";
import { IconCloudProviderS3 } from "@humansignal/icons";

export const s3Provider: ProviderConfig = {
  name: "s3",
  title: t("storage_settings.providers.s3.title"),
  description: t("storage_settings.providers.s3.description"),
  icon: IconCloudProviderS3,
  fields: [
    {
      name: "bucket",
      type: "text",
      label: t("storage_settings.providers.s3.fields.bucket.label"),
      required: true,
      placeholder: "my-storage-bucket",
      schema: z.string().min(1, t("storage_settings.providers.s3.validation.bucket_required")),
    },
    {
      name: "region_name",
      type: "text",
      label: t("storage_settings.providers.s3.fields.region_name.label"),
      placeholder: t("storage_settings.providers.s3.fields.region_name.placeholder"),
      schema: z.string().optional().default(""),
    },
    {
      name: "s3_endpoint",
      type: "text",
      label: t("storage_settings.providers.s3.fields.s3_endpoint.label"),
      placeholder: t("storage_settings.providers.s3.fields.s3_endpoint.placeholder"),
      schema: z.string().optional().default(""),
    },
    {
      name: "prefix",
      type: "text",
      label: t("storage_settings.providers.s3.fields.prefix.label"),
      placeholder: t("storage_settings.providers.s3.fields.prefix.placeholder"),
      schema: z.string().optional().default(""),
      target: "export",
    },
    {
      name: "aws_access_key_id",
      type: "password",
      label: t("storage_settings.providers.s3.fields.aws_access_key_id.label"),
      required: true,
      placeholder: "AKIAIOSFODNN7EXAMPLE",
      autoComplete: "off",
      accessKey: true,
      schema: z.string().min(1, t("storage_settings.providers.s3.validation.access_key_id_required")),
    },
    {
      name: "aws_secret_access_key",
      type: "password",
      label: t("storage_settings.providers.s3.fields.aws_secret_access_key.label"),
      required: true,
      placeholder: "wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY",
      autoComplete: "new-password",
      accessKey: true,
      schema: z.string().min(1, t("storage_settings.providers.s3.validation.secret_access_key_required")),
    },
    {
      name: "aws_session_token",
      type: "password",
      label: t("storage_settings.providers.s3.fields.aws_session_token.label"),
      placeholder: t("storage_settings.providers.s3.fields.aws_session_token.placeholder"),
      autoComplete: "new-password",
      schema: z.string().optional().default(""),
    },
    {
      name: "presign",
      type: "toggle",
      label: t("storage_settings.providers.s3.fields.presign.label"),
      description: t("storage_settings.providers.s3.fields.presign.description"),
      schema: z.boolean().default(true),
      target: "import",
      resetConnection: false,
    },
    {
      name: "presign_ttl",
      type: "counter",
      label: t("storage_settings.providers.s3.fields.presign_ttl.label"),
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
    { fields: ["region_name"] },
    { fields: ["s3_endpoint"] },
    { fields: ["prefix"] },
    { fields: ["aws_access_key_id"] },
    { fields: ["aws_secret_access_key"] },
    { fields: ["aws_session_token"] },
    { fields: ["presign", "presign_ttl"] },
  ],
};
