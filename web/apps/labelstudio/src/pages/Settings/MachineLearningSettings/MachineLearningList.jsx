import { formatDistanceToNow, format, parseISO } from "date-fns";
import { zhCN } from "date-fns/locale"; // 导入中文语言包
import { useCallback, useContext } from "react";
import { useTranslation } from "react-i18next"; // 导入 i18n hook

import truncate from "truncate-middle";
import { Dropdown, Menu } from "../../../components";
import { Button } from "@humansignal/ui";
import { confirm } from "../../../components/Modal/Modal";
import { Oneof } from "../../../components/Oneof/Oneof";
import { IconEllipsis } from "@humansignal/icons";
import { Tooltip } from "@humansignal/ui";
import { ApiContext } from "../../../providers/ApiProvider";
import { cn } from "../../../utils/bem";

import "./MachineLearningList.scss";

export const MachineLearningList = ({ backends, fetchBackends, onEdit, onTestRequest, onStartTraining }) => {
  const api = useContext(ApiContext);
  const { t } = useTranslation();

  const onDeleteModel = useCallback(
    async (backend) => {
      await api.callApi("deleteMLBackend", {
        params: {
          pk: backend.id,
        },
      });
      await fetchBackends();
    },
    [fetchBackends, api],
  );

  return (
    <div>
      {backends.map((backend) => (
        <BackendCard
          key={backend.id}
          backend={backend}
          onStartTrain={onStartTraining}
          onDelete={onDeleteModel}
          onEdit={onEdit}
          onTestRequest={onTestRequest}
          t={t} // 将 t 函数传递给子组件
        />
      ))}
    </div>
  );
};

// 接受 t 函数作为 prop
const BackendCard = ({ backend, onStartTrain, onEdit, onDelete, onTestRequest, t }) => {
  const confirmDelete = useCallback(
    (backend) => {
      confirm({
        title: t("ml_list.delete_modal_title", "Delete ML Backend"),
        body: t("ml_list.delete_modal_body", "This action cannot be undone. Are you sure?"),
        buttonLook: "destructive",
        onOk() {
          onDelete?.(backend);
        },
      });
    },
    [backend, onDelete, t],
  );

  const rootClass = cn("backend-card");

  return (
    <div className={rootClass.toClassName()}>
      <div className={rootClass.elem("title-container")}>
        <div>
          <BackendState backend={backend} t={t} />
          <div className={rootClass.elem("title")}>{backend.title}</div>
        </div>

        <div className={rootClass.elem("menu")}>
          <Dropdown.Trigger
            align="right"
            content={
              <Menu size="medium" contextual>
                <Menu.Item onClick={() => onEdit(backend)}>{t("common.edit", "Edit")}</Menu.Item>
                <Menu.Item onClick={() => onTestRequest(backend)}>
                  {t("ml_list.send_test_request", "Send Test Request")}
                </Menu.Item>
                <Menu.Item onClick={() => onStartTrain(backend)}>
                  {t("ml_list.start_training", "Start Training")}
                </Menu.Item>
                <Menu.Divider />
                <Menu.Item onClick={() => confirmDelete(backend)} isDangerous>
                  {t("common.delete", "Delete")}
                </Menu.Item>
              </Menu>
            }
          >
            <Button
              look="string"
              size="small"
              className="!p-0"
              aria-label={t("ml_list.model_options_aria", "Machine learning model options")}
            >
              <IconEllipsis />
            </Button>
          </Dropdown.Trigger>
        </div>
      </div>

      <div className={rootClass.elem("meta")}>
        <div className={rootClass.elem("group")}>{truncate(backend.url, 20, 10, "...")}</div>
        <div className={rootClass.elem("group")}>
          <Tooltip title={format(parseISO(backend.created_at), "yyyy-MM-dd HH:mm:ss")}>
            <span>
              {t("ml_list.created", "Created")}&nbsp;
              {formatDistanceToNow(parseISO(backend.created_at), { addSuffix: true, locale: zhCN })}
            </span>
          </Tooltip>
        </div>
      </div>
    </div>
  );
};

const BackendState = ({ backend, t }) => {
  const { state } = backend;

  return (
    <div className={cn("ml").elem("status")}>
      <span className={cn("ml").elem("indicator").mod({ state })} />
      <Oneof value={state} className={cn("ml").elem("status-label")}>
        <span case="DI">{t("ml_list.status_disconnected", "Disconnected")}</span>
        <span case="CO">{t("ml_list.status_connected", "Connected")}</span>
        <span case="ER">{t("ml_list.status_error", "Error")}</span>
        <span case="TR">{t("ml_list.status_training", "Training")}</span>
        <span case="PR">{t("ml_list.status_predicting", "Predicting")}</span>
      </Oneof>
    </div>
  );
};
