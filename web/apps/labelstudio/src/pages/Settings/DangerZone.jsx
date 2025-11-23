import { useMemo, useState } from "react";
import { useHistory } from "react-router";
import { useTranslation } from "react-i18next"; // 导入 i18n hook
import { Button, Typography, useToast } from "@humansignal/ui";
import { useUpdatePageTitle, createTitleFromSegments } from "@humansignal/core";
import { Label } from "../../components/Form";
import { modal } from "../../components/Modal/Modal";
import { useModalControls } from "../../components/Modal/ModalPopup";
import Input from "../../components/Form/Elements/Input/Input";
import { Space } from "../../components/Space/Space";
import { Spinner } from "../../components/Spinner/Spinner";
import { useAPI } from "../../providers/ApiProvider";
import { useProject } from "../../providers/ProjectProvider";
import { cn } from "../../utils/bem";
import i18next from "i18next";

export const DangerZone = () => {
  const { t } = useTranslation();
  const { project } = useProject();
  const api = useAPI();
  const history = useHistory();
  const toast = useToast();
  const [processing, setProcessing] = useState(null);

  useUpdatePageTitle(createTitleFromSegments([project?.title, t("danger_zone.page_title", "Danger Zone")]));

  const showDangerConfirmation = ({ title, message, requiredWord, buttonText, onConfirm }) => {
    const isDev = process.env.NODE_ENV === "development";

    return modal({
      title,
      width: 600,
      allowClose: false,
      body: () => {
        const ctrl = useModalControls();
        const inputValue = ctrl?.state?.inputValue || "";

        return (
          <div>
            <Typography variant="body" size="medium" className="mb-tight">
              {message}
            </Typography>
            <Input
              label={t("danger_zone.confirm_label", { requiredWord })}
              value={inputValue}
              onChange={(e) => ctrl?.setState({ inputValue: e.target.value })}
              autoFocus
              data-testid="danger-zone-confirmation-input"
              autoComplete="off"
            />
          </div>
        );
      },
      footer: () => {
        const ctrl = useModalControls();
        const inputValue = (ctrl?.state?.inputValue || "").trim().toLowerCase();
        const isValid = isDev || inputValue === requiredWord.toLowerCase();

        return (
          <Space align="end">
            <Button
              variant="neutral"
              look="outline"
              onClick={() => ctrl?.hide()}
              data-testid="danger-zone-cancel-button"
            >
              {t("cancel", "Cancel")}
            </Button>
            <Button
              variant="negative"
              disabled={!isValid}
              onClick={async () => {
                await onConfirm();
                ctrl?.hide();
              }}
              data-testid="danger-zone-confirm-button"
            >
              {buttonText}
            </Button>
          </Space>
        );
      },
    });
  };

  const handleOnClick = (type) => () => {
    const projectName = project.title;
    const actionConfig = {
      reset_cache: {
        title: t("danger_zone.reset_cache.title"),
        message: t("danger_zone.reset_cache.message", { projectName }),
        requiredWord: t("danger_zone.reset_cache.required_word"),
        buttonText: t("danger_zone.reset_cache.button_text"),
      },
      tabs: {
        title: t("danger_zone.drop_tabs.title"),
        message: t("danger_zone.drop_tabs.message", { projectName }),
        requiredWord: t("danger_zone.drop_tabs.required_word"),
        buttonText: t("danger_zone.drop_tabs.button_text"),
      },
      project: {
        title: t("danger_zone.delete_project.title"),
        message: t("danger_zone.delete_project.message", { projectName }),
        requiredWord: t("danger_zone.delete_project.required_word"),
        buttonText: t("danger_zone.delete_project.button_text"),
      },
    };

    const config = actionConfig[type];
    if (!config) return;

    showDangerConfirmation({
      ...config,
      onConfirm: async () => {
        setProcessing(type);
        try {
          if (type === "reset_cache") {
            await api.callApi("projectResetCache", { params: { pk: project.id } });
            toast.show({ message: t("danger_zone.reset_cache.success_message") });
          } else if (type === "tabs") {
            await api.callApi("deleteTabs", { body: { project: project.id } });
            toast.show({ message: t("danger_zone.drop_tabs.success_message") });
          } else if (type === "project") {
            await api.callApi("deleteProject", { params: { pk: project.id } });
            toast.show({ message: t("danger_zone.delete_project.success_message") });
            history.replace("/projects");
          }
        } catch (error) {
          toast.show({ message: t("common.error_message", { message: error.message }), type: "error" });
        } finally {
          setProcessing(null);
        }
      },
    });
  };

  const buttons = useMemo(
    () => [
      // ... (dynamically generated buttons can be complex to translate directly,
      //      we will handle the static ones first)
      {
        type: "reset_cache",
        help: t("danger_zone.reset_cache.help"),
        label: t("danger_zone.reset_cache.button_text"),
      },
      {
        type: "tabs",
        help: t("danger_zone.drop_tabs.help"),
        label: t("danger_zone.drop_tabs.button_text"),
      },
      {
        type: "project",
        help: t("danger_zone.delete_project.help"),
        label: t("danger_zone.delete_project.button_text"),
      },
    ],
    [t],
  );

  return (
    <div className={cn("simple-settings")}>
      <Typography variant="headline" size="medium" className="mb-tighter">
        {t("danger_zone.section_title", "Danger Zone")}
      </Typography>
      <Typography variant="body" size="medium" className="text-neutral-content-subtler !mb-base">
        {t("danger_zone.description", "Perform these actions at your own risk. Actions you take on this page can't be reverted. Make sure your data is backed up.")}
      </Typography>

      {project.id ? (
        <div style={{ marginTop: 16 }}>
          {buttons.map((btn) => {
            const waiting = processing === btn.type;
            const disabled = btn.disabled || (processing && !waiting);

            return (
              btn.disabled !== true && (
                <div className={cn("settings-wrapper")} key={btn.type}>
                  <Typography variant="title" size="large">
                    {btn.label}
                  </Typography>
                  {btn.help && <Label description={btn.help} style={{ width: 600, display: "block" }} />}
                  <Button
                    key={btn.type}
                    variant="negative"
                    look="outlined"
                    disabled={disabled}
                    waiting={waiting}
                    onClick={handleOnClick(btn.type)}
                    style={{ marginTop: 16 }}
                  >
                    {btn.label}
                  </Button>
                </div>
              )
            );
          })}
        </div>
      ) : (
        <div style={{ display: "flex", justifyContent: "center", marginTop: 32 }}>
          <Spinner size={32} />
        </div>
      )}
    </div>
  );
};

DangerZone.title = i18next.t("danger_zone.menu_title");
DangerZone.path = "/danger-zone";
