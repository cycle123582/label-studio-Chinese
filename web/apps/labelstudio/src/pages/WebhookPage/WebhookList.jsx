import { IconCross, IconExternal, IconPencil, IconWebhook } from "@humansignal/icons";
import { Button, EmptyState, SimpleCard, Typography } from "@humansignal/ui";
import clsx from "clsx";
import { format } from "date-fns";
// 导入中文语言包，虽然手动格式化了，但保留以防万一
import { zhCN } from "date-fns/locale";
import { useCallback, useState } from "react"; // 引入 useState
import { useTranslation } from "react-i18next";
import { Toggle } from "../../components/Form";
import { useAPI } from "../../providers/ApiProvider";
// 确保 WebhookDeleteModal 是默认导出或具名导出，根据你上一个文件的写法调整
import WebhookDeleteModal from "./WebhookDeleteModal";
import { ABILITY, useAuth } from "@humansignal/core/providers/AuthProvider";

const WebhookListItem = ({ webhook, onSelectActive, onActiveChange, onDelete, canChangeWebhooks }) => {
  const { t } = useTranslation();
  // 新增：控制删除弹窗的显示状态
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  return (
    <li
      className={clsx(
        "flex justify-between items-center p-2 text-base border border-neutral-border rounded-lg group",
        canChangeWebhooks && "hover:bg-neutral-surface",
      )}
    >
      <div>
        <div className="flex items-center">
          <div>
            <Toggle
              name={`toggle-${webhook.id}`} // 保证 name 唯一
              checked={webhook.is_active}
              onChange={(e) => onActiveChange(webhook.id, e.target.checked)}
              disabled={!canChangeWebhooks}
            />
          </div>
          <div
            className={clsx(
              "max-w-[370px] overflow-hidden text-ellipsis font-medium ml-2",
              canChangeWebhooks && "cursor-pointer",
            )}
            onClick={canChangeWebhooks ? () => onSelectActive(webhook.id) : undefined}
          >
            {webhook.url}
          </div>
        </div>
        <div className="text-neutral-content-subtler text-sm mt-1">
          {/* 汉化日期格式：2023-11-19 14:00 */}
          {t("webhook_list.created_at", "Created")}: {format(new Date(webhook.created_at), "yyyy-MM-dd HH:mm")}
        </div>
      </div>

      {canChangeWebhooks && (
        <div className="hidden group-hover:flex gap-2">
          <Button variant="primary" look="outlined" onClick={() => onSelectActive(webhook.id)} icon={<IconPencil />}>
            {t("common.edit", "Edit")}
          </Button>
          {/* 修改：点击按钮仅打开弹窗状态 */}
          <Button variant="negative" look="outlined" onClick={() => setShowDeleteModal(true)} icon={<IconCross />}>
            {t("common.delete", "Delete")}
          </Button>
        </div>
      )}

      {/* 渲染删除弹窗 */}
      {showDeleteModal && (
        <WebhookDeleteModal
          onClose={() => setShowDeleteModal(false)}
          onConfirm={async () => {
            await onDelete();
            setShowDeleteModal(false);
          }}
        />
      )}
    </li>
  );
};

const WebhookList = ({ onSelectActive, onAddWebhook, webhooks, fetchWebhooks }) => {
  const { t } = useTranslation();
  const api = useAPI();
  const { permissions } = useAuth();
  const canChangeWebhooks = permissions.can(ABILITY.can_change_webhooks);

  if (webhooks === null) return <></>;

  // 补全：切换激活状态的逻辑
  const onActiveChange = useCallback(async (id, isActive) => {
    try {
      await api.callApi('updateWebhook', {
        params: { pk: id },
        body: { is_active: isActive }
      });
      // 成功后刷新列表
      await fetchWebhooks();
    } catch(err) {
      console.error("Failed to update webhook status", err);
    }
  }, [api, fetchWebhooks]);

  return (
    <>
      <header className="mb-base">
        <Typography variant="headline" size="medium" className="mb-tight">
          {t("webhook_list.section_title", "Webhooks")}
        </Typography>
        {webhooks.length > 0 && (
          <Typography size="small" className="text-neutral-content-subtler">
            {t("webhook_list.description", "Setup integrations that subscribe to certain events using Webhooks.")}
          </Typography>
        )}
      </header>
      <div className="w-full">
        {webhooks.length === 0 ? (
          <SimpleCard title="" className="bg-primary-background border-primary-border-subtler p-base">
            <EmptyState
              size="medium"
              variant="primary"
              icon={<IconWebhook />}
              title={t("webhook_list.empty_title", "Add your first webhook")}
              description={t("webhook_list.empty_desc", "Setup integrations that subscribe to certain events using Webhooks.")}
              actions={
                canChangeWebhooks ? (
                  <Button variant="primary" look="filled" onClick={onAddWebhook}>
                    {t("webhook_list.add_button", "Add Webhook")}
                  </Button>
                ) : (
                  <Typography variant="body" size="small">
                    {t("webhook_list.contact_admin", "Contact your administrator to create Webhooks")}
                  </Typography>
                )
              }
              footer={
                !window.APP_SETTINGS.whitelabel_is_active && (
                  <Typography variant="label" size="small" className="text-primary-link">
                    <a href="https://docs.humansignal.com/guide/webhooks.html" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 hover:underline" aria-label={t("webhook_list.empty_learn_more_aria", "Learn more about webhooks")}>
                      {t("common.learn_more", "Learn more")}
                      <IconExternal width={16} height={16} />
                    </a>
                  </Typography>
                )
              }
            />
          </SimpleCard>
        ) : (
          <ul className="space-y-4 mt-wide">
            {webhooks.map((obj) => (
              <WebhookListItem
                key={obj.id}
                webhook={obj}
                onSelectActive={onSelectActive}
                onActiveChange={onActiveChange}
                // 传递具体的删除逻辑
                onDelete={async () => {
                    try {
                        await api.callApi("deleteWebhook", { params: { pk: obj.id } });
                        await fetchWebhooks();
                    } catch(e) {
                        console.error(e);
                    }
                }}
                canChangeWebhooks={canChangeWebhooks}
              />
            ))}
          </ul>
        )}
      </div>
      {webhooks.length > 0 && canChangeWebhooks && (
        <div className="flex justify-end w-full mt-base">
          <Button variant="primary" look="filled" onClick={onAddWebhook}>
            {t("webhook_list.add_button", "Add Webhook")}
          </Button>
        </div>
      )}
    </>
  );
};

export default WebhookList;
