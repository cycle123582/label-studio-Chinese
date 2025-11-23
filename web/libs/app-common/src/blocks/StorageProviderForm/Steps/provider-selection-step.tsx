import { Label } from "@humansignal/ui";
import { useEffect } from "react";
// 1. 引入 useTranslation
import { useTranslation } from "react-i18next";
import { ProviderGrid } from "../components";
import type { ProviderConfig } from "../types/provider";

interface ProviderSelectionStepProps {
  formData: {
    provider: string;
  };
  errors: {
    provider?: string;
  };
  handleSelectChange: (name: string, value: string) => void;
  setFormState: (updater: (prevState: any) => any) => void;
  storageTypesLoading?: boolean;
  target?: "import" | "export";
  providers: Record<string, ProviderConfig>;
}

export const ProviderSelectionStep = ({
  formData,
  errors,
  handleSelectChange,
  providers,
}: ProviderSelectionStepProps) => {
  // 2. 初始化翻译函数
  const { t } = useTranslation();

  // Set default provider if none is selected and we have options
  useEffect(() => {
    if (!formData.provider && Object.entries(providers).length > 0) {
      // Find the first non-disabled provider
      const enabledProviders = Object.values(providers).filter((provider) => !provider.disabled);
      if (enabledProviders.length > 0) {
        handleSelectChange("provider", enabledProviders[0].name);
      }
    }
  }, [providers, formData.provider, handleSelectChange]);

  // Get the selected provider config
  const selectedProvider = formData.provider ? providers[formData.provider] : null;
  const isSelectedProviderDisabled = selectedProvider?.disabled || false;

  // Get the message content from the provider config
  const getMessageContent = () => {
    if (!selectedProvider?.fields) return null;

    const messageField = selectedProvider.fields.find((field) => field.type === "message");
    return messageField?.content || null;
  };

  const messageContent = getMessageContent();

  return (
    <div className="space-y-6">
      <div>
        {/* 3. 翻译标题 */}
        <h2 className="text-xl font-semibold">{t("storage_settings.selection_step.title")}</h2>
        {/* 4. 翻译描述 */}
        <p className="text-muted-foreground">{t("storage_settings.selection_step.description")}</p>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          {/* 5. 翻译标签 */}
          <Label text={t("storage_settings.selection_step.label")} required />
          <ProviderGrid
            providers={providers}
            selectedProvider={formData.provider}
            onProviderSelect={(providerName) => handleSelectChange("provider", providerName)}
            error={errors.provider}
          />
        </div>

        {/* Show alert message when disabled provider is selected */}
        {isSelectedProviderDisabled && messageContent && (
          <div>{typeof messageContent === "function" ? messageContent({}) : messageContent}</div>
        )}
      </div>
    </div>
  );
};
