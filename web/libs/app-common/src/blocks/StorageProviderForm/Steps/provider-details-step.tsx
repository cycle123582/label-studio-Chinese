import { getProviderConfig } from "../providers";
import { ProviderForm } from "../components/provider-form";
import Input from "apps/labelstudio/src/components/Form/Elements/Input/Input";
import { Toggle } from "@humansignal/ui";
// 1. 引入 useTranslation
import { useTranslation } from "react-i18next";

interface ProviderDetailsStepProps {
  formData: any;
  errors: Record<string, string>;
  handleProviderFieldChange: (name: string, value: any) => void;
  handleFieldBlur?: (name: string, value: any) => void;
  provider?: string;
  isEditMode?: boolean;
  target?: "import" | "export";
}

export const ProviderDetailsStep = ({
  formData,
  errors,
  handleProviderFieldChange,
  handleFieldBlur,
  provider,
  isEditMode = false,
  target,
}: ProviderDetailsStepProps) => {
  // 2. 初始化翻译函数
  const { t } = useTranslation();

  const providerConfig = getProviderConfig(provider);

  if (!provider || !providerConfig) {
    // 3. 翻译错误信息
    return (
      <div className="text-red-500">
        {!provider
          ? t("storage_settings.details_step.error_no_provider")
          : t("storage_settings.details_step.error_unknown_provider", { provider })}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        {/* providerConfig.title 和 description 在之前的 provider 配置文件中已经汉化过了，这里直接显示即可 */}
        <h2 className="text-xl font-semibold">{providerConfig.title}</h2>
        <p className="text-muted-foreground">{providerConfig.description}</p>
      </div>

      {/* Title field - common for all providers */}
      <div className="space-y-2">
        <Input
          name="title"
          value={formData.title ?? ""}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleProviderFieldChange("title", e.target.value)}
          // 4. 翻译 placeholder
          placeholder={t("storage_settings.details_step.title.placeholder")}
          validate=""
          skip={false}
          labelProps={{}}
          ghost={false}
          tooltip=""
          tooltipIcon={null}
          required={true}
          // 5. 翻译 label
          label={t("storage_settings.details_step.title.label")}
          // 6. 翻译 description
          description={t("storage_settings.details_step.title.description")}
          footer={errors.title ? <span className="text-negative-content">{errors.title}</span> : ""}
          className={errors.title ? "border-negative-content" : ""}
        />
      </div>

      <ProviderForm
        provider={providerConfig}
        formData={formData}
        errors={errors}
        onChange={handleProviderFieldChange}
        onBlur={handleFieldBlur}
        isEditMode={isEditMode}
        target={target}
      />

      {/* Export-specific common fields */}
      {target === "export" && (
        <div className="space-y-6">
          <div className="space-y-2">
            <Toggle
              checked={formData.can_delete_objects ?? false}
              onChange={(e) => handleProviderFieldChange("can_delete_objects", e.target.checked)}
              // 7. 翻译 Toggle 相关属性
              aria-label={t("storage_settings.details_step.can_delete_objects.label")}
              label={t("storage_settings.details_step.can_delete_objects.label")}
              description={t("storage_settings.details_step.can_delete_objects.description")}
            />
          </div>
        </div>
      )}
    </div>
  );
};
