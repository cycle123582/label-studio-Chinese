import React, { type FC, type ReactNode } from "react";
// 1. 引入 i18n hook
import { useTranslation } from "react-i18next";
import {
  IconUpload,
  IconLsLabeling,
  IconCheck,
  IconSearch,
  IconInbox,
  IconCloudProviderS3,
  IconCloudProviderGCS,
  IconCloudProviderAzure,
  IconCloudProviderRedis,
} from "@humansignal/icons";
import { Button, IconExternal, Typography, Tooltip } from "@humansignal/ui";
import { getDocsUrl } from "../../../../../../editor/src/utils/docs";
import { ABILITY, useAuth } from "@humansignal/core/providers/AuthProvider";

declare global {
  interface Window {
    APP_SETTINGS?: {
      whitelabel_is_active?: boolean;
    };
  }
}

// ... (Interfaces 保持不变，为了节省篇幅省略) ...
interface EmptyStateProps {
  canImport: boolean;
  onOpenSourceStorageModal?: () => void;
  onOpenImportModal?: () => void;
  userRole?: string;
  project?: {
    assignment_settings?: {
      label_stream_task_distribution?: "auto_distribution" | "assigned_only" | string;
    };
  };
  hasData?: boolean;
  hasFilters?: boolean;
  canLabel?: boolean;
  onLabelAllTasks?: () => void;
  onClearFilters?: () => void;
}

interface EmptyStateLayoutProps {
  icon: ReactNode;
  iconBackground?: string;
  iconColor?: string;
  title: string;
  description: string;
  actions?: ReactNode;
  additionalContent?: ReactNode;
  footer?: ReactNode;
  testId?: string;
  ariaLabelledBy?: string;
  ariaDescribedBy?: string;
  wrapperClassName?: string;
}

// ... (renderEmptyStateLayout 函数保持不变) ...
const renderEmptyStateLayout = ({
  icon,
  iconBackground = "bg-primary-emphasis",
  iconColor = "text-primary-icon",
  title,
  description,
  actions,
  additionalContent,
  footer,
  testId,
  ariaLabelledBy,
  ariaDescribedBy,
  wrapperClassName = "w-full h-full flex flex-col items-center justify-center text-center p-wide",
}: EmptyStateLayoutProps) => {
  // ... (内容保持不变)
  const iconWithSize = React.cloneElement(icon as React.ReactElement, {
    width: 40,
    height: 40,
  });

  const content = (
    <div className={wrapperClassName}>
      <div className={`flex items-center justify-center ${iconBackground} ${iconColor} rounded-full p-tight mb-4`}>
        {iconWithSize}
      </div>

      <Typography variant="headline" size="medium" className="mb-tight" id={ariaLabelledBy}>
        {title}
      </Typography>

      <Typography
        size="medium"
        className={`text-neutral-content-subtler max-w-xl ${actions || additionalContent ? "mb-tight" : ""}`}
        id={ariaDescribedBy}
      >
        {description}
      </Typography>

      {additionalContent}

      {actions &&
        (() => {
          const flattenedActions = React.Children.toArray(actions).flat().filter(Boolean);
          const actualActionCount = flattenedActions.length;
          const isSingleAction = actualActionCount === 1;

          return (
            <div className={`flex ${isSingleAction ? "justify-center" : ""} gap-base w-full max-w-md mt-base`}>
              {actions}
            </div>
          );
        })()}

      {footer && <div className="mt-6">{footer}</div>}
    </div>
  );

  if (testId === "empty-state-label") {
    return (
      <div
        data-testid={testId}
        aria-labelledby={ariaLabelledBy}
        aria-describedby={ariaDescribedBy}
        className="w-full flex items-center justify-center m-0"
      >
        <div className="w-full h-full">{content}</div>
      </div>
    );
  }

  return content;
};

// Storage provider icons component
const StorageProviderIcons = () => {
  const { t } = useTranslation(); // 使用 Hook

  return (
    <div className="flex items-center justify-center gap-base mb-wide" data-testid="dm-storage-provider-icons">
      <Tooltip title="Amazon S3">
        <div className="flex items-center justify-center p-2" aria-label="Amazon S3">
          <IconCloudProviderS3 width={32} height={32} className="text-neutral-content-subtler" />
        </div>
      </Tooltip>
      <Tooltip title="Google Cloud Storage">
        <div className="flex items-center justify-center p-2" aria-label="Google Cloud Storage">
          <IconCloudProviderGCS width={32} height={32} className="text-neutral-content-subtler" />
        </div>
      </Tooltip>
      <Tooltip title="Azure Blob Storage">
        <div className="flex items-center justify-center p-2" aria-label="Azure Blob Storage">
          <IconCloudProviderAzure width={32} height={32} className="text-neutral-content-subtler" />
        </div>
      </Tooltip>
      {/* 这里使用 t 函数 */}
      <Tooltip title={t("data_manager.storage.redis", "Redis Storage")}>
        <div className="flex items-center justify-center p-2" aria-label="Redis Storage">
          <IconCloudProviderRedis width={32} height={32} className="text-neutral-content-subtler" />
        </div>
      </Tooltip>
    </div>
  );
};

// Documentation link component
const DocumentationLink = () => {
  const { t } = useTranslation(); // 使用 Hook

  if (window.APP_SETTINGS?.whitelabel_is_active) {
    return null;
  }

  return (
    <Typography variant="label" size="small" className="text-primary-link hover:underline">
      <a
        href={getDocsUrl("guide/tasks")}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1"
        data-testid="dm-docs-data-import-link"
      >
        {t("data_manager.empty_state.docs_link", "See docs on importing data")}
        <span className="sr-only"> {t("common.opens_new_tab", "(opens in a new tab)")}</span>
        <IconExternal width={20} height={20} />
      </a>
    </Typography>
  );
};

export const EmptyState: FC<EmptyStateProps> = ({
  canImport,
  onOpenSourceStorageModal,
  onOpenImportModal,
  userRole,
  project,
  hasData: _hasData,
  hasFilters,
  canLabel: _canLabel,
  onLabelAllTasks,
  onClearFilters,
}) => {
  const isImportEnabled = Boolean(canImport);
  const { permissions } = useAuth();
  const { t } = useTranslation(); // 使用 Hook

  // 1. 筛选器空状态
  if (hasFilters) {
    return renderEmptyStateLayout({
      icon: <IconSearch />,
      iconBackground: "bg-warning-background",
      iconColor: "text-warning-icon",
      title: t("data_manager.empty_state.no_tasks_found", "No tasks found"),
      description: t("data_manager.empty_state.adjust_filters", "Try adjusting or clearing the filters to see more results"),
      actions: (
        <Button variant="primary" look="outlined" onClick={onClearFilters} data-testid="dm-clear-filters-button">
          {t("data_manager.empty_state.clear_filters", "Clear Filters")}
        </Button>
      ),
    });
  }

  // 2. 角色空状态 (Reviewer/Annotator)
  if (userRole === "REVIEWER" || userRole === "ANNOTATOR") {
    if (userRole === "REVIEWER") {
      return renderEmptyStateLayout({
        icon: <IconCheck />,
        title: t("data_manager.empty_state.reviewer_no_tasks_title", "No tasks available for review or labeling"),
        description: t("data_manager.empty_state.reviewer_no_tasks_desc", "Tasks imported to this project will appear here"),
      });
    }

    if (userRole === "ANNOTATOR") {
      const isAutoDistribution = project?.assignment_settings?.label_stream_task_distribution === "auto_distribution";
      const isManualDistribution = project?.assignment_settings?.label_stream_task_distribution === "assigned_only";

      if (isAutoDistribution) {
        return renderEmptyStateLayout({
          icon: <IconLsLabeling />,
          title: t("data_manager.empty_state.annotator_start_labeling", "Start labeling tasks"),
          description: t("data_manager.empty_state.annotator_labeled_desc", "Tasks you've labeled will appear here"),
          actions: (
            <Button
              variant="primary"
              look="filled"
              disabled={false}
              onClick={onLabelAllTasks}
              data-testid="dm-label-all-tasks-button"
            >
              {t("data_manager.empty_state.label_all_tasks", "Label All Tasks")}
            </Button>
          ),
        });
      }

      if (isManualDistribution) {
        return renderEmptyStateLayout({
          icon: <IconInbox />,
          title: t("data_manager.empty_state.no_tasks_available", "No tasks available"),
          description: t("data_manager.empty_state.annotator_assigned_desc", "Tasks assigned to you will appear here"),
        });
      }

      return renderEmptyStateLayout({
        icon: <IconInbox width={40} height={40} />,
        title: t("data_manager.empty_state.no_tasks_available", "No tasks available"),
        description: t("data_manager.empty_state.tasks_will_appear_here", "Tasks will appear here when they become available"),
      });
    }
  }

  // 3. 默认空状态 (Admin/Manager Import)
  return renderEmptyStateLayout({
    icon: <IconUpload />,
    title: t("data_manager.empty_state.import_title", "Import data to get your project started"),
    description: t("data_manager.empty_state.import_desc", "Connect your cloud storage or upload files from your computer"),
    testId: "empty-state-label",
    ariaLabelledBy: "dm-empty-title",
    ariaDescribedBy: "dm-empty-desc",
    additionalContent: <StorageProviderIcons />,
    actions: (
      <>
        {permissions.can(ABILITY.can_manage_storage) && (
          <Button
            variant="primary"
            look="filled"
            className="flex-1"
            onClick={onOpenSourceStorageModal}
            data-testid="dm-connect-source-storage-button"
          >
            {t("data_manager.empty_state.connect_storage", "Connect Cloud Storage")}
          </Button>
        )}

        {isImportEnabled && (
          <Button
            variant="primary"
            look="outlined"
            className="flex-1"
            onClick={onOpenImportModal}
            data-testid="dm-import-button"
          >
            {t("data_manager.empty_state.import_button", "Import")}
          </Button>
        )}
      </>
    ),
    footer: <DocumentationLink />,
  });
};
