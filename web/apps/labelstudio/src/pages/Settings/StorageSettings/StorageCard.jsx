import { useCallback, useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next"; // 导入 i18n hook
import { Card, Dropdown, Menu } from "../../../components";
import { Button } from "@humansignal/ui";
import { ApiContext } from "../../../providers/ApiProvider";
import { StorageSummary } from "./StorageSummary";
import { IconEllipsisVertical } from "@humansignal/icons";

export const StorageCard = ({ rootClass, target, storage, onEditStorage, onDeleteStorage, storageTypes }) => {
  const { t } = useTranslation(); // 初始化 t 函数
  const [syncing, setSyncing] = useState(false);
  const api = useContext(ApiContext);
  const [storageData, setStorageData] = useState({ ...storage });
  const [synced, setSynced] = useState(null);

  const startSync = useCallback(async () => {
    setSyncing(true);
    setSynced(null);

    const result = await api.callApi("syncStorage", {
      params: {
        target,
        type: storageData.type,
        pk: storageData.id,
      },
    });

    if (result) {
      setStorageData(result);
      setSynced(result.last_sync_count);
    }

    setSyncing(false);
  }, [storage, target, storageData.type, storageData.id, api]); // 更新依赖项

  useEffect(() => {
    setStorageData(storage);
  }, [storage]);

  const notSyncedYet = synced !== null || ["in_progress", "queued"].includes(storageData.status);

  // 使用 t 函数创建默认标题
  const defaultTitle = t("storage_card.untitled", { type: storageData.type }, `Untitled ${storageData.type}`);

  return (
    <Card
      header={storageData.title ?? defaultTitle}
      extra={
        <Dropdown.Trigger
          align="right"
          content={
            <Menu size="compact" style={{ width: 110 }}>
              <Menu.Item onClick={() => onEditStorage(storageData)}>{t("common.edit", "Edit")}</Menu.Item>
              <Menu.Item onClick={() => onDeleteStorage(storageData)}>{t("common.delete", "Delete")}</Menu.Item>
            </Menu>
          }
        >
          <Button look="string" className="-ml-3" aria-label={t("storage_card.options_aria", "Storage options")}>
            <IconEllipsisVertical />
          </Button>
        </Dropdown.Trigger>
      }
    >
      <StorageSummary
        target={target}
        storage={storageData}
        className={rootClass.elem("summary")}
        storageTypes={storageTypes}
      />
      <div className={rootClass.elem("sync")}>
        <div className="mt-base">
          <Button
            look="outlined"
            waiting={syncing}
            onClick={startSync}
            disabled={notSyncedYet}
            aria-label={t("storage_card.sync_aria", "Sync Storage")}
          >
            {t("storage_card.sync_button", "Sync Storage")}
          </Button>
          {notSyncedYet && (
            <div className={rootClass.elem("sync-count")}>
              {t(
                "storage_card.sync_in_progress",
                "Syncing may take some time, please refresh the page to see the current status.",
              )}
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};
