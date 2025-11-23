import { Button, cnm } from "@humansignal/ui";
// 1. 引入 useTranslation
import { useTranslation } from "react-i18next";

interface FormFooterProps {
  currentStep: number;
  totalSteps: number;
  onPrevious: () => void;
  onNext: () => void;
  onSave?: () => void;
  isEditMode: boolean;
  connectionChecked: boolean;
  filesPreview: any[] | null;
  testConnection: {
    isLoading: boolean;
    mutate: () => void;
  };
  loadPreview: {
    isLoading: boolean;
    mutate: () => void;
  };
  createStorage: {
    isLoading: boolean;
  };
  saveStorage?: {
    isLoading: boolean;
  };
  target?: "import" | "export";
  isProviderDisabled?: boolean;
}

export const FormFooter = ({
  currentStep,
  totalSteps,
  onPrevious,
  onNext,
  onSave,
  isEditMode,
  connectionChecked,
  filesPreview,
  testConnection,
  loadPreview,
  createStorage,
  saveStorage,
  target,
  isProviderDisabled = false,
}: FormFooterProps) => {
  // 2. 初始化翻译函数
  const { t } = useTranslation();

  return (
    <div className="flex items-center justify-between p-wide border-t border-neutral-border bg-neutral-background">
      <Button look="outlined" onClick={onPrevious} disabled={currentStep === 0}>
        {/* 3. 翻译 Previous */}
        {t("storage_settings.footer.previous")}
      </Button>

      <div className="flex gap-tight items-center">
        {(isEditMode ? currentStep === 0 : currentStep === 1) && (
          <>
            <Button
              waiting={testConnection.isLoading}
              onClick={testConnection.mutate}
              variant={connectionChecked ? "positive" : "primary"}
              className={cnm({
                "border-none shadow-none bg-positive-surface-content-subtle text-positive-content pointer-events-none":
                  connectionChecked,
              })}
              style={connectionChecked ? { textShadow: "none" } : {}}
            >
              {/* 4. 翻译连接状态按钮 */}
              {connectionChecked
                ? t("storage_settings.footer.connection_verified")
                : t("storage_settings.footer.test_connection")}
            </Button>
          </>
        )}

        {(isEditMode ? currentStep === 1 : currentStep === 2) && (
          <Button waiting={loadPreview.isLoading} onClick={loadPreview.mutate} disabled={filesPreview !== null}>
            {/* 5. 翻译预览按钮 */}
            {filesPreview !== null
              ? t("storage_settings.footer.preview_loaded")
              : t("storage_settings.footer.load_preview")}
          </Button>
        )}

        <Button
          onClick={onNext}
          waiting={currentStep === totalSteps - 1 && createStorage.isLoading}
          disabled={
            (!isEditMode && currentStep === 1 && !connectionChecked) || (currentStep === 0 && isProviderDisabled)
          }
          look={currentStep === totalSteps - 1 && target !== "export" ? "outlined" : undefined}
          // 6. 翻译 Tooltip
          tooltip={
            currentStep === 1 && !connectionChecked
              ? t("storage_settings.footer.tooltips.test_before_continue")
              : currentStep === 0 && isProviderDisabled
                ? t("storage_settings.footer.tooltips.provider_disabled")
                : undefined
          }
        >
          {/* 7. 翻译 Next/Save/Save & Sync 按钮逻辑 */}
          {currentStep < totalSteps - 1
            ? t("storage_settings.footer.next")
            : target === "export"
              ? t("storage_settings.footer.save")
              : t("storage_settings.footer.save_sync")}
        </Button>

        {currentStep === totalSteps - 1 && target !== "export" && onSave && (
          <Button onClick={onSave} waiting={saveStorage?.isLoading}>
            {/* 8. 翻译单独的 Save 按钮 */}
            {t("storage_settings.footer.save")}
          </Button>
        )}
      </div>
    </div>
  );
};
