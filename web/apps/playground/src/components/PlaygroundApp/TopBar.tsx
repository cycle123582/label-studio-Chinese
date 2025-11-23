import { memo, useCallback } from "react";
import { ThemeToggle, IconLink, IconCopyOutline, Tooltip } from "@humansignal/ui";
import { useAtomValue } from "jotai";
import { configAtom } from "../../atoms/configAtoms";
import { getParentUrl } from "../../utils/url";
import { useCopyText } from "../../hooks/useCopyText";
import { useTranslation } from "react-i18next"; // 1. 引入翻译钩子

const ShareUrlButton = () => {
  const { t } = useTranslation(); // 2. 初始化翻译
  const config = useAtomValue(configAtom);
  const copyText = useCopyText({
    // 3. 汉化提示消息
    successMessage: t("playground.copy_url_success", "URL copied to clipboard"),
    errorMessage: t("playground.copy_url_error", "Failed to copy URL to clipboard"),
  });

  const handleCopy = useCallback(() => {
    const url = getParentUrl();
    url.searchParams.set("config", encodeURIComponent(config.replace(/\n/g, "<br>")));
    copyText(url.toString());
  }, [config, copyText]);

  const title = t("playground.share_url_tooltip", "Share labeling config URL"); // 4. 汉化 Tooltip

  return (
    <Tooltip title={title}>
      <button
        type="button"
        className="flex items-center justify-center h-8 w-8 gap-2 border border-neutral-border rounded-md"
        aria-label={title}
        onClick={handleCopy}
      >
        <IconLink width={22} height={22} className="flex-shrink-0" />
      </button>
    </Tooltip>
  );
};

const CopyButton = () => {
  const { t } = useTranslation(); // 5. 初始化翻译
  const config = useAtomValue(configAtom);
  const copyText = useCopyText({
    // 6. 汉化提示消息
    successMessage: t("playground.copy_config_success", "Config copied to clipboard"),
    errorMessage: t("playground.copy_config_error", "Failed to copy config to clipboard"),
  });

  const handleCopy = useCallback(() => {
    copyText(config);
  }, [config, copyText]);

  const title = t("playground.copy_config_tooltip", "Copy labeling config"); // 7. 汉化 Tooltip

  return (
    <Tooltip title={title}>
      <button
        type="button"
        className="flex items-center justify-center h-8 w-8 gap-2 border border-neutral-border rounded-md"
        aria-label={title}
        onClick={handleCopy}
      >
        <IconCopyOutline width={18} height={18} className="flex-shrink-0" />
      </button>
    </Tooltip>
  );
};

const ShareButtons = () => {
  return (
    <div className="flex items-center gap-2">
      <CopyButton />
      <ShareUrlButton />
    </div>
  );
};

export const TopBar = memo(
  () => {
    const { t } = useTranslation(); // 8. 初始化翻译

    return (
      <div className="flex items-center h-10 px-tight text-heading-medium justify-between select-none border-b border-neutral-border">
        <div className="flex items-center gap-2">
          <span className="font-semibold tracking-tight text-body-medium">
            {/* 9. 汉化标题 (Playground -> 演练场) */}
            Label Studio <span className="text-accent-persimmon-base">{t("playground.title", "Playground")}</span>
          </span>
        </div>
        <div className="flex items-center gap-4">
          <ShareButtons />
          <ThemeToggle />
        </div>
      </div>
    );
  },
  () => true,
);
