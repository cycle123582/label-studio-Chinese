import { IconCross, IconPlus } from "@humansignal/icons";
import { Button, Typography } from "@humansignal/ui";
import cloneDeep from "lodash/cloneDeep";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Form, Input, Label, Toggle } from "../../components/Form";
import { useAPI } from "../../providers/ApiProvider";
import { cn } from "../../utils/bem";
import { useProject } from "../../providers/ProjectProvider";
import WebhookDeleteModal from "./WebhookDeleteModal"; // 确保默认导入

const WebhookForm = ({
  webhook,
  webhooksInfo,
  fetchWebhooks,
  onSelectActive,
  onBack,
  projectId,
  headers,
  onAddHeaderClick,
  onHeaderRemove,
  onHeaderChange,
  sendForAllActions,
  setSendForAllActions,
  actions,
  onActionChange,
  isActive,
  setIsActive,
  sendPayload,
  setSendPayload,
  api,
  rootClass,
}) => {
  const { t } = useTranslation();
  // 新增：控制删除弹窗
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  return (
    <>
      <Form
        action={webhook === null ? "createWebhook" : "updateWebhook"}
        params={webhook === null ? {} : { pk: webhook.id }}
        formData={webhook}
        prepareData={(data) => {
          return {
            ...data,
            project: projectId,
            send_for_all_actions: sendForAllActions,
            headers: Object.fromEntries(
              headers.filter((header) => header.key !== "").map((header) => [header.key, header.value]),
            ),
            actions: Array.from(actions),
            is_active: isActive,
            send_payload: sendPayload,
          };
        }}
        onSubmit={async (response) => {
          if (!response.error_message) {
            await fetchWebhooks();
            onSelectActive(null);
          }
        }}
      >
        {/* Row 1: URL & Active */}
        <Form.Row columnCount={1}>
          <Label text={t("webhook_form.payload_url_label", "Payload URL")} large />
          <div className="grid grid-cols-[1fr_135px] gap-tight">
            <Input name="url" className="self-stretch w-auto" placeholder="https://api.example.com/hooks..." />
            <div className="grid grid-flow-col auto-cols-max items-center justify-end gap-tight self-center">
              <span className="text-neutral-content">{t("webhook_form.is_active_label", "Is Active")}</span>
              <Toggle
                skip
                checked={isActive}
                onChange={(e) => {
                  setIsActive(e.target.checked);
                }}
              />
            </div>
          </div>
        </Form.Row>

        {/* Row 2: Headers */}
        <Form.Row columnCount={1}>
          <div className="border border-neutral-border p-4 rounded-lg mb-4">
            <div className="flex flex-col gap-tight">
              <div className="flex items-center justify-between">
                <Label text={t("webhook_form.headers_label", "Headers")} large />
                <Button
                  type="button"
                  variant="primary"
                  look="string"
                  onClick={onAddHeaderClick}
                  className="!p-0 [&_span]:!text-[var(--grape_500)]"
                  leading={<IconPlus />}
                  tooltip={t("webhook_form.add_header_tooltip", "Add Header")}
                />
              </div>
              {headers.map((header, index) => {
                return (
                  <div key={header.id} className="grid grid-cols-[1fr_1fr_40px] gap-tight">
                    <Input
                      skip
                      placeholder={t("webhook_form.header_key_placeholder", "Key")}
                      value={header.key}
                      onChange={(e) => onHeaderChange("key", e, index)}
                    />
                    <Input
                      skip
                      placeholder={t("webhook_form.header_value_placeholder", "Value")}
                      value={header.value}
                      onChange={(e) => onHeaderChange("value", e, index)}
                    />
                    <div>
                      <Button
                        variant="negative"
                        look="string"
                        className="h-8 w-8 !p-0"
                        type="button"
                        icon={<IconCross />}
                        onClick={() => onHeaderRemove(index)}
                        tooltip={t("webhook_form.remove_header_tooltip", "Remove Header")}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </Form.Row>

        {/* Row 3: Payload Settings */}
        <div className="border border-neutral-border p-4 rounded-lg mb-4">
          <div>
            <Label text={t("webhook_form.payload_label", "Payload")} large />
          </div>
          <div>
            <div className="my-2">
              <Toggle
                skip
                checked={sendPayload}
                onChange={(e) => { setSendPayload(e.target.checked); }}
                label={t("webhook_form.send_payload_toggle", "Send payload")}
              />
            </div>
            <div className="my-2">
              <Toggle
                skip
                checked={sendForAllActions}
                label={t("webhook_form.send_for_all_actions_toggle", "Send for all actions")}
                onChange={(e) => { setSendForAllActions(e.target.checked); }}
              />
            </div>
            <div>
              {!sendForAllActions ? (
                <div>
                  <h4 className="text-neutral-content mt-4 mb-2">{t("webhook_form.send_payload_for_title", "Send Payload for")}</h4>
                  <div className="grid grid-cols-2 gap-2">
                    {Object.entries(webhooksInfo || {}).map(([key, value]) => {
                      return (
                        <div key={key}>
                          <Toggle
                            skip
                            name={key}
                            type="checkbox"
                            label={value.name} // 这里 value.name 是后端返回的英文，如果后端没翻译，这里暂时只能显示英文
                            onChange={onActionChange}
                            checked={actions.has(key)}
                          />
                        </div>
                      );
                    })}
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        </div>

        {/* Footer Buttons */}
        <div className="flex items-center gap-2 mt-base pt-4 border-t border-neutral-border">
          {webhook !== null && (
            <Button
              type="button"
              variant="negative"
              look="outlined"
              aria-label={t("webhook_form.delete_aria", "Delete webhook")}
              onClick={() => setShowDeleteModal(true)}
            >
              {t("webhook_form.delete_button", "Delete Webhook")}
            </Button>
          )}

          <div className={rootClass.elem("status")}><Form.Indicator /></div>

          <Button
            variant="neutral"
            look="outlined"
            type="button"
            className="ml-auto"
            onClick={onBack}
            aria-label={t("webhook_form.cancel_aria", "Cancel webhook edit")}
          >
            {t("cancel", "Cancel")}
          </Button>

          <Button
            look="primary"
            className={rootClass.elem("save-button")}
            aria-label={webhook === null ? t("webhook_form.add_aria", "Add Webhook") : t("webhook_form.save_aria", "Save Changes")}
          >
            {webhook === null ? t("webhook_form.add_button", "Add Webhook") : t("webhook_form.save_button", "Save Changes")}
          </Button>
        </div>
      </Form>

      {/* Delete Modal */}
      {showDeleteModal && (
        <WebhookDeleteModal
          onClose={() => setShowDeleteModal(false)}
          onConfirm={async () => {
            try {
               await api.callApi("deleteWebhook", { params: { pk: webhook.id } });
               await fetchWebhooks();
               onBack();
            } catch(e) {
               console.error(e);
            }
          }}
        />
      )}
    </>
  );
};

const WebhookDetail = ({ webhook, webhooksInfo, fetchWebhooks, onBack, onSelectActive }) => {
  const { t } = useTranslation();
  const rootClass = cn("webhook-detail");
  const api = useAPI();
  const { project } = useProject();
  const projectId = project?.id;

  // State Management
  const [headers, setHeaders] = useState(
    webhook?.headers ? Object.entries(webhook.headers).map(([key, value], index) => ({ id: `header-${Date.now()}-${index}`, key, value })) : [],
  );
  const [sendForAllActions, setSendForAllActions] = useState(webhook?.send_for_all_actions ?? true);
  const [actions, setActions] = useState(new Set(webhook?.actions ?? []));
  const [isActive, setIsActive] = useState(webhook?.is_active ?? true);
  const [sendPayload, setSendPayload] = useState(webhook?.send_payload ?? true);

  // Handlers
  const onAddHeaderClick = () => {
    setHeaders([...headers, { id: `header-${Date.now()}-${headers.length}`, key: "", value: "" }]);
  };

  const onHeaderRemove = (index) => {
    const newHeaders = [...headers];
    newHeaders.splice(index, 1);
    setHeaders(newHeaders);
  };

  const onHeaderChange = (type, e, index) => {
    const newHeaders = [...headers];
    newHeaders[index][type] = e.target.value;
    setHeaders(newHeaders);
  };

  const onActionChange = (e) => {
    const newActions = new Set(actions);
    if (e.target.checked) {
      newActions.add(e.target.name);
    } else {
      newActions.delete(e.target.name);
    }
    setActions(newActions);
  };

  if (!projectId) return <></>;

  return (
    <>
      <header className="page-header flex items-center gap-2 mb-6">
        <Typography as="a" variant="headline" size="medium" onClick={() => onSelectActive(null)} className="cursor-pointer text-neutral-content-subtler hover:text-neutral-content-subtle hover:underline">
          {t("webhook_detail.breadcrumb_webhooks", "Webhooks")}
        </Typography>
        <Typography variant="headline" size="medium" className="text-neutral-content-subtler">
          / {webhook === null ? t("webhook_detail.breadcrumb_new", "New Webhook") : t("webhook_detail.breadcrumb_edit", "Edit Webhook")}
        </Typography>
      </header>
      <div className="mt-base">
        <WebhookForm
          webhook={webhook}
          webhooksInfo={webhooksInfo}
          fetchWebhooks={fetchWebhooks}
          onSelectActive={onSelectActive}
          onBack={onBack}
          projectId={projectId}
          headers={headers}
          onAddHeaderClick={onAddHeaderClick}
          onHeaderRemove={onHeaderRemove}
          onHeaderChange={onHeaderChange}
          sendForAllActions={sendForAllActions}
          setSendForAllActions={setSendForAllActions}
          actions={actions}
          onActionChange={onActionChange}
          isActive={isActive}
          setIsActive={setIsActive}
          sendPayload={sendPayload}
          setSendPayload={setSendPayload}
          api={api}
          rootClass={rootClass}
        />
      </div>
    </>
  );
};

export default WebhookDetail;
