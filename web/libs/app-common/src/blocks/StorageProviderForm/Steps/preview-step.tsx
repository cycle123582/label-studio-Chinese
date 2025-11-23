import { Label, Toggle, Select, Tooltip, cn } from "@humansignal/ui";
import { Form, Input } from "apps/labelstudio/src/components/Form";
import { IconDocument, IconSearch } from "@humansignal/icons";
import { formatDistanceToNow } from "date-fns";
import { zhCN } from "date-fns/locale"; // 引入中文语言包 (如果需要日期显示为中文)
import type { ForwardedRef } from "react";
// 1. 引入 useTranslation
import { useTranslation } from "react-i18next";

interface PreviewStepProps {
  formData: any;
  formState: any;
  setFormState: (updater: (prevState: any) => any) => void;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  action: string;
  target: string;
  type: string;
  project: string;
  storage?: any;
  onSubmit: () => void;
  formRef: ForwardedRef<unknown>;
  filesPreview: any[] | null;
  formatSize: (bytes: number) => string;
  onImportSettingsChange?: () => void;
}

const regexFilters = [
  {
    title: "Images",
    regex: ".*.(jpe?g|png|gif)$",
    blob: true,
  },
  {
    title: "Videos",
    regex: ".*\\.(mp4|avi|mov|wmv|webm)$",
    blob: true,
  },
  {
    title: "Audio",
    regex: ".*\\.(mp3|wav|ogg|flac)$",
    blob: true,
  },
  {
    title: "Tabular",
    regex: ".*\\.(csv|tsv)$",
    blob: true,
  },
  {
    title: "JSON",
    regex: ".*\\.json$",
    blob: false,
  },
  {
    title: "JSONL",
    regex: ".*\\.jsonl$",
    blob: false,
  },
  {
    title: "Parquet",
    regex: ".*\\.parquet$",
    blob: false,
  },
  {
    title: "All Tasks Files",
    regex: ".*\\.(json|jsonl|parquet)$",
    blob: false,
  },
] as const;

export const PreviewStep = ({
  formData,
  formState,
  setFormState,
  handleChange,
  action,
  target,
  type,
  project,
  storage,
  onSubmit,
  formRef,
  filesPreview,
  formatSize,
  onImportSettingsChange,
}: PreviewStepProps) => {
  // 2. 初始化翻译函数
  const { t } = useTranslation();

  return (
    <div className="space-y-6">
      <div>
        {/* 3. 翻译标题和描述 */}
        <h2 className="text-xl font-semibold">{t("storage_settings.preview_step.title")}</h2>
        <p className="text-muted-foreground">{t("storage_settings.preview_step.description")}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left Column Header */}
        {/* 4. 翻译配置头部 */}
        <h4>{t("storage_settings.preview_step.config_header")}</h4>

        {/* Right Column Header with Button */}
        <div className="flex justify-between items-center">
          {/* 5. 翻译预览头部 */}
          <h4>{t("storage_settings.preview_step.preview_header")}</h4>
        </div>

        {/* Left Column: Configuration */}
        <div>
          <Form
            ref={formRef}
            action={action}
            params={{ target, type, project, pk: storage?.id }}
            formData={formData}
            skipEmpty={false}
            onSubmit={onSubmit}
            autoFill="off"
            autoComplete="off"
          >
            <div className="space-y-8">
              {/* Path/Bucket Prefix Section - Hide for localfiles since it has its own path field */}
              {type !== "localfiles" && (
                <div className="space-y-2">
                  {/* 6. 翻译 Label */}
                  <Label
                    text={`${type === "redis"
                      ? t("storage_settings.preview_step.path.label")
                      : t("storage_settings.preview_step.path.bucket_prefix")} ${t("storage_settings.preview_step.path.label_suffix")}`}
                  />
                  <p className="text-sm text-muted-foreground">
                    {/* 7. 翻译描述 */}
                    {type === "redis"
                      ? t("storage_settings.preview_step.path.desc_redis")
                      : t("storage_settings.preview_step.path.desc_bucket")}
                  </p>
                  <Input
                    id={type === "redis" ? "path" : "prefix"}
                    name={type === "redis" ? "path" : "prefix"}
                    value={type === "redis" ? (formData.path ?? "") : (formData.prefix ?? "")}
                    onChange={(e) => {
                      handleChange(e);
                      // Reset preview when prefix/path changes
                      onImportSettingsChange?.();
                    }}
                    // 8. 翻译 placeholder
                    placeholder={t("storage_settings.preview_step.path.placeholder")}
                    style={{ width: "100%" }}
                    required={false}
                    skip={false}
                    labelProps={{}}
                    ghost={false}
                    tooltipIcon={null}
                  />
                </div>
              )}

              {/* Import Method */}
              <div className="space-y-2">
                {/* 9. 翻译 Import Method Label */}
                <Label text={t("storage_settings.preview_step.import_method.label")} />
                <p className="text-sm text-muted-foreground">{t("storage_settings.preview_step.import_method.description")}</p>
                <Select
                  name="use_blob_urls"
                  value={formData.use_blob_urls ? "Files" : "Tasks"}
                  onChange={(value) => {
                    const isFiles = value === "Files";
                    setFormState((prevState) => ({
                      ...prevState,
                      formData: {
                        ...prevState.formData,
                        use_blob_urls: isFiles,
                        regex_filter: "", // Reset regex filter when import method changes
                      },
                    }));
                    // Reset validation state when import method changes
                    onImportSettingsChange?.();
                  }}
                  options={
                    [
                      {
                        value: "Files",
                        // 10. 翻译 Select 选项
                        label: t("storage_settings.preview_step.import_method.option_files"),
                      },
                      {
                        value: "Tasks",
                        label: t("storage_settings.preview_step.import_method.option_tasks"),
                      },
                    ] as any
                  }
                  // 11. 翻译 placeholder
                  placeholder={t("storage_settings.preview_step.import_method.placeholder")}
                />
              </div>

              {/* File Filter Section */}
              <div className="space-y-2">
                {/* 12. 翻译 Filter Label */}
                <Label text={t("storage_settings.preview_step.file_filter.label")} />
                <p className="text-sm text-muted-foreground">{t("storage_settings.preview_step.file_filter.description")}</p>
                <Input
                  id="regex_filter"
                  name="regex_filter"
                  value={formData.regex_filter ?? ""}
                  onChange={(e) => {
                    handleChange(e);
                    // Reset preview when regex filter changes
                    onImportSettingsChange?.();
                  }}
                  // 13. 翻译 placeholder
                  placeholder={
                    formData.use_blob_urls
                      ? t("storage_settings.preview_step.file_filter.placeholder_files")
                      : t("storage_settings.preview_step.file_filter.placeholder_tasks")
                  }
                  style={{ width: "100%" }}
                  label=""
                  description=""
                  footer=""
                  className=""
                  validate=""
                  required={false}
                  skip={false}
                  labelProps={{}}
                  ghost={false}
                  tooltip=""
                  tooltipIcon={null}
                />

                <div className="flex flex-wrap gap-x-2 items-center text-xs">
                  {/* 14. 翻译 Common filters */}
                  <span className="text-muted-foreground">{t("storage_settings.preview_step.file_filter.common_filters")}</span>
                  {regexFilters
                    .filter((r) => r.blob === formData.use_blob_urls)
                    .map((r) => {
                      return (
                        <button
                          key={r.regex}
                          type="button"
                          className="text-blue-600 border-b border-dotted border-blue-400 hover:text-blue-800"
                          onClick={(e) => {
                            e.preventDefault();
                            setFormState((prevState) => ({
                              ...prevState,
                              formData: {
                                ...prevState.formData,
                                regex_filter: r.regex,
                              },
                            }));
                            // Reset preview when common filter is selected
                            onImportSettingsChange?.();
                          }}
                        >
                          {/* 15. 翻译过滤器名称 */}
                          {t(`storage_settings.preview_step.filters.${r.title}`, { defaultValue: r.title })}
                        </button>
                      );
                    })}
                </div>
              </div>

              {/* Scan All Subfolders */}
              <div className="flex items-center justify-between">
                <div>
                  {/* 16. 翻译 recursive scan Label */}
                  <Label text={t("storage_settings.preview_step.scan_subfolders.label")} className="block mb-2" />
                  <p className="text-sm text-muted-foreground">{t("storage_settings.preview_step.scan_subfolders.description")}</p>
                </div>
                <Toggle
                  checked={formData.recursive_scan ?? false}
                  onChange={(e) => {
                    setFormState((prevState) => ({
                      ...prevState,
                      formData: {
                        ...prevState.formData,
                        recursive_scan: e.target.checked,
                      },
                    }));
                    // Reset validation state when recursive scan changes
                    onImportSettingsChange?.();
                  }}
                />
              </div>
            </div>
          </Form>
        </div>

        {/* Right Column: Preview Files */}
        <div className="border rounded-md overflow-hidden h-[340px]">
          <div className="bg-card h-full flex flex-col">
            {filesPreview === null ? (
              // No API response yet
              <div className="flex flex-col items-center justify-center py-12 px-4 text-center flex-grow">
                <div className="rounded-full bg-muted p-3 mb-4">
                  <IconDocument className="h-6 w-6 text-muted-foreground" />
                </div>
                {/* 17. 翻译 No Preview */}
                <h3 className="font-medium mb-1">{t("storage_settings.preview_step.preview_area.no_preview")}</h3>
                <p className="text-sm text-muted-foreground max-w-md">
                  {t("storage_settings.preview_step.preview_area.no_preview_desc")}
                </p>
              </div>
            ) : filesPreview.length === 0 ? (
              // API returned empty array
              <div className="flex flex-col items-center justify-center py-12 px-4 text-center flex-grow">
                <div className="rounded-full bg-muted p-3 mb-4">
                  <IconSearch className="h-6 w-6 text-muted-foreground" />
                </div>
                {/* 18. 翻译 No Files */}
                <h3 className="font-medium mb-1">{t("storage_settings.preview_step.preview_area.no_files")}</h3>
                <p className="text-sm text-muted-foreground max-w-md">
                  {t("storage_settings.preview_step.preview_area.no_files_desc")}
                </p>
              </div>
            ) : (
              // Files available - display in a table format with fixed height and scrolling
              <div className="px-2 py-2 flex-grow overflow-auto">
                <div className="grid grid-cols-1 text-xs gap-1">
                  {filesPreview.map((file, index) => (
                    <div
                      key={index}
                      className={cn(
                        "flex justify-between py-0.5 px-2 bg-neutral-surface border-b last:border-b-0 rounded-small",
                        {
                          "hover:bg-neutral-surface-hover": file.key !== null,
                        },
                      )}
                    >
                      <Tooltip title={file.key || "..."} disabled={file.key === null}>
                        <div
                          className={cn("max-w-[260px] overflow-hidden", {
                            "cursor-help": file.key !== null,
                          })}
                        >
                          {file.key ? (
                            file.key.length > 28 ? (
                              <span>
                                {file.key.slice(0, 12)}...{file.key.slice(-13)}
                              </span>
                            ) : (
                              file.key
                            )
                          ) : (
                            <span className="italic">{t("storage_settings.preview_step.preview_area.limit_reached")}</span>
                          )}
                        </div>
                      </Tooltip>
                      <div className="flex items-center space-x-1 text-muted-foreground whitespace-nowrap">
                        <span>
                          {/* 19. 格式化时间为相对时间 (例如: 5分钟前) */}
                          {file.last_modified && formatDistanceToNow(new Date(file.last_modified), { addSuffix: true, locale: zhCN })}
                        </span>
                        <span className="mx-0.5">•</span>
                        <span>{file.size && formatSize(file.size)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
