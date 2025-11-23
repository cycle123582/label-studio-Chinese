import { format } from "date-fns/esm";
import { zhCN } from "date-fns/locale"; // 导入中文语言包
import { useTranslation } from "react-i18next"; // 导入 i18n hook
import { Button, CodeBlock, IconFileCopy, Space, Tooltip } from "@humansignal/ui";
import { DescriptionList } from "../../../components/DescriptionList/DescriptionList";
import { modal } from "../../../components/Modal/Modal";
import { Oneof } from "../../../components/Oneof/Oneof";
import { getLastTraceback } from "../../../utils/helpers";
import { useCopyText } from "@humansignal/core";

// Component to handle copy functionality within the modal
const CopyButton = ({ msg }) => {
  const { t } = useTranslation();
  const [copyText, copied] = useCopyText({ defaultText: msg });

  return (
    <Button variant="neutral" icon={<IconFileCopy />} onClick={() => copyText()} disabled={copied} className="w-[7rem]">
      {copied ? t("common.copied", "Copied!") : t("common.copy", "Copy")}
    </Button>
  );
};

export const StorageSummary = ({ target, storage, className, storageTypes = [] }) => {
  const { t } = useTranslation();

  // 翻译存储状态
  const storageStatus = t(`storage_summary.status_${storage.status.toLowerCase()}`, storage.status.replace(/_/g, " ").replace(/(^\w)/, (match) => match.toUpperCase()));

  const last_sync_count = storage.last_sync_count ? storage.last_sync_count : 0;
  const tasks_existed = storage.meta?.tasks_existed ?? 0;
  const total_annotations = storage.meta?.total_annotations ?? 0;

  // 翻译帮助文本 (help text)
  const tasks_added_help = t("storage_summary.help_tasks_added", { count: last_sync_count });
  const tasks_total_help = [
    t("storage_summary.help_tasks_existed", { count: tasks_existed }),
    t("storage_summary.help_tasks_total", { count: tasks_existed + last_sync_count }),
  ].join("\n");
  const annotations_help = t("storage_summary.help_annotations_added", { count: last_sync_count });
  const total_annotations_help = storage.meta?.total_annotations !== undefined ? t("storage_summary.help_annotations_total", { count: total_annotations }) : "";

  const handleButtonClick = () => {
    // 翻译错误日志信息
    const msg =
      `${t("storage_summary.error_log_for", {
        target: target === "export" ? t("storage_summary.export", "export") : "",
        type: storage.type,
        id: storage.id,
        project: storage.project,
        job: storage.last_sync_job,
      })}\n\n` +
      `${getLastTraceback(storage.traceback)}\n\n` +
      `meta = ${JSON.stringify(storage.meta)}\n`;

    const currentModal = modal({
      title: t("storage_summary.error_log_title", "Storage Sync Error Log"),
      body: <CodeBlock code={msg} variant="negative" className="max-h-[50vh] overflow-y-auto" />,
      footer: (
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          {!window.APP_SETTINGS?.whitelabel_is_active && (
            <div>
              <>
                <a
                  href="https://labelstud.io/guide/storage.html#Troubleshooting"
                  target="_blank"
                  rel="noreferrer noopener"
                  aria-label={t("storage_summary.troubleshooting_aria", "Learn more about cloud storage troubleshooting")}
                >
                  {t("storage_summary.see_docs", "See docs")}
                </a>{" "}
                {t("storage_summary.troubleshooting_text", "for troubleshooting tips on cloud storage connections.")}
              </>
            </div>
          )}
          <Space>
            <CopyButton msg={msg} />
            <Button variant="primary" className="w-[7rem]" onClick={() => currentModal.close()}>
              {t("common.close", "Close")}
            </Button>
          </Space>
        </div>
      ),
      style: { width: "700px" },
      optimize: false,
      allowClose: true,
    });
  };

  return (
    <div className={className}>
      <DescriptionList>
        <DescriptionList.Item term={t("storage_summary.term_type", "Type")}>
          {/* 尝试使用 i18n 翻译 key: storage_settings.providers.s3.title */}
          {t(`storage_settings.providers.${storage.type}.title`, {
            defaultValue: (storageTypes ?? []).find((s) => s.name === storage.type)?.title ?? storage.type
          })}
        </DescriptionList.Item>

        <Oneof value={storage.type}>
          <SummaryS3 case={["s3", "s3s"]} storage={storage} t={t} />
          <GSCStorage case="gcs" storage={storage} t={t} />
          <AzureStorage case="azure" storage={storage} t={t} />
          <RedisStorage case="redis" storage={storage} t={t} />
          <LocalStorage case="localfiles" storage={storage} t={t} />
        </Oneof>

        <DescriptionList.Item
          term={t("storage_summary.term_status", "Status")}
          help={[
            t("storage_summary.status_help_initialized"),
            t("storage_summary.status_help_queued"),
            t("storage_summary.status_help_in_progress"),
            t("storage_summary.status_help_failed"),
            t("storage_summary.status_help_completed_with_errors"),
            t("storage_summary.status_help_completed"),
          ].join("\n")}
        >
          {storage.status === "failed" || storage.status === "completed_with_errors" ? (
            <span
              className="cursor-pointer border-b border-dashed border-negative-border-subtle text-negative-content"
              onClick={handleButtonClick}
            >
              {storageStatus} ({t("storage_summary.view_logs", "View Logs")})
            </span>
          ) : (
            storageStatus
          )}
        </DescriptionList.Item>

        {target === "export" ? (
          <DescriptionList.Item term={t("storage_summary.term_annotations", "Annotations")} help={`${annotations_help}\n${total_annotations_help}`}>
            <Tooltip title={annotations_help}>
              <span>{last_sync_count}</span>
            </Tooltip>
            <Tooltip title={total_annotations_help}>
              <span> ({t("storage_summary.total", { count: total_annotations })})</span>
            </Tooltip>
          </DescriptionList.Item>
        ) : (
          <DescriptionList.Item term={t("storage_summary.term_tasks", "Tasks")} help={`${tasks_added_help}\n${tasks_total_help}`}>
            <Tooltip title={`${tasks_added_help}\n${tasks_total_help}`} style={{ whiteSpace: "pre-wrap" }}>
              <span>{last_sync_count + tasks_existed}</span>
            </Tooltip>
            <Tooltip title={tasks_added_help}>
              <span> ({t("storage_summary.new", { count: last_sync_count })})</span>
            </Tooltip>
          </DescriptionList.Item>
        )}

        <DescriptionList.Item term={t("storage_summary.term_last_sync", "Last Sync")}>
          {storage.last_sync ? format(new Date(storage.last_sync), "yyyy MMMM dd ∙ HH:mm:ss", { locale: zhCN }) : t("storage_summary.not_synced_yet", "Not synced yet")}
        </DescriptionList.Item>
      </DescriptionList>
    </div>
  );
};

// 子组件现在接收并使用 t 函数
const SummaryS3 = ({ storage, t }) => {
  return <DescriptionList.Item term={t("storage_summary.term_bucket", "Bucket")}>{storage.bucket}</DescriptionList.Item>;
};
const GSCStorage = ({ storage, t }) => {
  return <DescriptionList.Item term={t("storage_summary.term_bucket", "Bucket")}>{storage.bucket}</DescriptionList.Item>;
};
const AzureStorage = ({ storage, t }) => {
  return <DescriptionList.Item term={t("storage_summary.term_container", "Container")}>{storage.container}</DescriptionList.Item>;
};
const RedisStorage = ({ storage, t }) => {
  return (
    <>
      <DescriptionList.Item term={t("storage_summary.term_path", "Path")}>{storage.path}</DescriptionList.Item>
      <DescriptionList.Item term={t("storage_summary.term_host", "Host")}>
        {storage.host}
        {storage.port ? `:${storage.port}` : ""}
      </DescriptionList.Item>
    </>
  );
};
const LocalStorage = ({ storage, t }) => {
  return <DescriptionList.Item term={t("storage_summary.term_path", "Path")}>{storage.path}</DescriptionList.Item>;
};
