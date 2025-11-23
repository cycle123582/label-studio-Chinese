// 1. 引入 useTranslation
import { useTranslation } from "react-i18next";

interface ReviewStepProps {
  formData: any;
  filesPreview?: any;
  formatSize?: (bytes: number) => string;
}

export const ReviewStep = ({ formData, filesPreview, formatSize }: ReviewStepProps) => {
  // 2. 初始化翻译函数
  const { t } = useTranslation();

  const getProviderDisplayName = (provider: string) => {
    const providerMap: Record<string, string> = {
      s3: "Amazon S3",
      gcp: "Google Cloud Storage",
      azure: "Azure Blob Storage",
      redis: "Redis",
      localfiles: t("storage_settings.review_step.providers.localfiles", "Local Files"), // 翻译本地文件
    };
    return providerMap[provider] || provider;
  };

  const getBucketName = () => {
    // 3. 翻译 "Not specified"
    return formData.bucket || formData.container || t("storage_settings.review_step.labels.not_specified");
  };

  const getFileCount = () => {
    // 4. 翻译 "0 files"
    if (!filesPreview) return t("storage_settings.review_step.file_stats.zero_files");

    // Check if the last file is the "preview limit reached" indicator
    const lastFile = filesPreview[filesPreview.length - 1];
    const hasMoreFiles = lastFile && lastFile.key === null;

    if (hasMoreFiles) {
      // Subtract 1 to exclude the placeholder file
      const visibleFileCount = filesPreview.length - 1;
      // 5. 翻译 "More than X files"
      return t("storage_settings.review_step.file_stats.more_than_files", { count: visibleFileCount });
    }

    // 6. 翻译 "X files"
    return t("storage_settings.review_step.file_stats.file_count", { count: filesPreview.length });
  };

  const getTotalSize = () => {
    if (!filesPreview || !formatSize) return t("storage_settings.review_step.file_stats.zero_bytes");

    // Check if the last file is the "preview limit reached" indicator
    const lastFile = filesPreview[filesPreview.length - 1];
    const hasMoreFiles = lastFile && lastFile.key === null;

    // Calculate total size excluding the placeholder file if it exists
    const filesToCount = hasMoreFiles ? filesPreview.slice(0, -1) : filesPreview;
    const totalBytes = filesToCount.reduce((sum: number, file: any) => sum + (file.size || 0), 0);

    if (hasMoreFiles) {
      // 7. 翻译 "More than X size"
      return t("storage_settings.review_step.file_stats.more_than_size", { size: formatSize(totalBytes) });
    }

    return formatSize(totalBytes);
  };

  return (
    <div>
      <div className="border-b pb-4 mb-6">
        {/* 8. 翻译主标题和描述 */}
        <h2 className="text-2xl font-bold text-gray-900">{t("storage_settings.review_step.title")}</h2>
        <p className="text-gray-600 mt-1">{t("storage_settings.review_step.description")}</p>
      </div>

      {/* Connection Details Section */}
      <div className="grid grid-cols-2 gap-y-4 mb-8">
        <div>
          {/* 9. 翻译 Provider Label */}
          <p className="text-sm text-gray-500">{t("storage_settings.review_step.labels.provider")}</p>
          <p className="font-medium">{getProviderDisplayName(formData.provider)}</p>
        </div>

        <div>
          {/* 10. 翻译 Storage Location Label */}
          <p className="text-sm text-gray-500">{t("storage_settings.review_step.labels.storage_location")}</p>
          <p className="font-medium">{getBucketName()}</p>
        </div>

        {formData.prefix && (
          <div>
            {/* 11. 翻译 Prefix Label */}
            <p className="text-sm text-gray-500">{t("storage_settings.review_step.labels.prefix")}</p>
            <p className="font-medium">{formData.prefix}</p>
          </div>
        )}

        {filesPreview && (
          <>
            <div>
              {/* 12. 翻译 Files to import Label */}
              <p className="text-sm text-gray-500">{t("storage_settings.review_step.labels.files_to_import")}</p>
              <p className="font-medium">{getFileCount()}</p>
            </div>

            <div>
              {/* 13. 翻译 Total size Label */}
              <p className="text-sm text-gray-500">{t("storage_settings.review_step.labels.total_size")}</p>
              <p className="font-medium">{getTotalSize()}</p>
            </div>
          </>
        )}
      </div>

      {/* Import Process Section */}
      <div className="bg-primary-background border border-primary-border-subtler rounded-small p-4 mb-8">
        {/* 14. 翻译导入进程说明 */}
        <h3 className="text-lg font-semibold mb-2">{t("storage_settings.review_step.import_process.title")}</h3>
        <p>{t("storage_settings.review_step.import_process.description")}</p>
      </div>
    </div>
  );
};
