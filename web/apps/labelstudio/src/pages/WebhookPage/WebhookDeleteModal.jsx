import { useTranslation } from "react-i18next";
import { Button } from "@humansignal/ui";
// 注意：这里我们导入 Modal 组件本身，而不是 modal 工具函数
import { Modal } from "../../components/Modal/Modal";
import { Space } from "../../components/Space/Space";
import { cn } from "../../utils/bem";

const WebhookDeleteModal = ({ onClose, onConfirm }) => {
  const { t } = useTranslation();
  const rootClass = cn("webhook-delete-modal");

  return (
    <Modal
      visible={true} // 因为是由父组件的 state 控制渲染的，所以这里始终为 true
      onHide={onClose}
      title={t("webhook_delete_modal.delete_button", "Delete Webhook")} // 标题现在可以完美翻译了
      style={{ width: 512 }}
      footer={
        <Space align="end">
          <Button
            look="outlined"
            onClick={onClose}
            aria-label={t("webhook_delete_modal.cancel_aria", "Cancel webhook deletion")}
          >
            {t("cancel", "Cancel")}
          </Button>
          <Button
            variant="negative"
            onClick={onConfirm}
            aria-label={t("webhook_delete_modal.confirm_aria", "Confirm webhook deletion")}
          >
            {t("webhook_delete_modal.delete_button", "Delete Webhook")}
          </Button>
        </Space>
      }
    >
      <div className={rootClass}>
        <div className={rootClass.elem("modal-text")}>
          {t(
            "webhook_delete_modal.confirmation_message",
            "Are you sure you want to delete the webhook? This action cannot be undone.",
          )}
        </div>
      </div>
    </Modal>
  );
};

export default WebhookDeleteModal;
