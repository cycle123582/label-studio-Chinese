import { StorageProviderForm } from "@humansignal/app-common/blocks/StorageProviderForm";
import { ff } from "@humansignal/core";
import { Button } from "@humansignal/ui";
import { useAtomValue } from "jotai";
import { forwardRef, useCallback, useContext, useImperativeHandle } from "react";
import { useTranslation } from "react-i18next"; // 导入 i18n hook
import { Columns } from "../../../components";
import { confirm, modal } from "../../../components/Modal/Modal";
import { Spinner } from "../../../components/Spinner/Spinner";
import { ApiContext } from "../../../providers/ApiProvider";
import { projectAtom } from "../../../providers/ProjectProvider";
import { providers } from "./providers";
import { StorageCard } from "./StorageCard";
import { StorageForm } from "./StorageForm";

export const StorageSet = forwardRef(
  (
    {
      title,
      target,
      rootClass,
      buttonLabel,
      // Props from parent for lifted state
      storageTypes,
      storages,
      storagesLoaded,
      loading,
      loaded,
      fetchStorages,
    },
    ref,
  ) => {
    const { t } = useTranslation(); // 初始化 t 函数
    const api = useContext(ApiContext);
    const project = useAtomValue(projectAtom);

    const useNewStorageScreen = ff.isActive(ff.FF_NEW_STORAGES);

    const showStorageFormModal = useCallback(
      (storage) => {
        // 使用 t 函数动态生成标题
        const action = storage ? t("common.edit", "Edit") : t("storage_set.connect", "Connect");
        const actionTarget =
          target === "export" ? t("storage_set.target", "Target") : t("storage_set.source", "Source");
        const title = `${action} ${actionTarget} ${t("storage_set.storage", "Storage")}`;

        const modalRef = modal({
          title,
          closeOnClickOutside: false,
          style: { width: 840 },
          bare: useNewStorageScreen,
          onHidden: () => {},
          body: useNewStorageScreen ? (
            <StorageProviderForm
              title={title}
              target={target}
              storage={storage}
              project={project.id}
              rootClass={rootClass}
              storageTypes={storageTypes}
              providers={providers}
              onSubmit={async () => {
                modalRef.close();
                fetchStorages();
              }}
              onHide={() => {}}
            />
          ) : (
            <StorageForm
              target={target}
              storage={storage}
              project={project.id}
              rootClass={rootClass}
              storageTypes={storageTypes}
              onSubmit={async () => {
                await fetchStorages();
                modalRef.close();
              }}
            />
          ),
        });
      },
      [project, fetchStorages, target, rootClass, t, useNewStorageScreen], // 将 t 和 useNewStorageScreen 加入依赖项
    );

    const onEditStorage = useCallback(
      async (storage) => {
        showStorageFormModal(storage);
      },
      [showStorageFormModal],
    );

    useImperativeHandle(
      ref,
      () => ({
        openAddModal: () => showStorageFormModal(),
      }),
      [showStorageFormModal],
    );

    const onDeleteStorage = useCallback(
      async (storage) => {
        confirm({
          title: t("storage_set.delete_modal_title", "Deleting storage"),
          body: t("storage_set.delete_modal_body", "This action cannot be undone. Are you sure?"),
          buttonLook: "negative",
          onOk: async () => {
            const response = await api.callApi("deleteStorage", {
              params: {
                type: storage.type,
                pk: storage.id,
                target,
              },
            });

            if (response !== null) fetchStorages();
          },
        });
      },
      [fetchStorages, api, target, t], // 将 t 加入依赖项
    );

    return (
      <Columns.Column title={title}>
        <div className={rootClass.elem("controls")}>
          <Button
            onClick={() => showStorageFormModal()}
            disabled={loading}
            look="outlined"
            data-testid={`add-${target === "export" ? "target" : "source"}-storage-button`}
            aria-label={
              target === "export"
                ? t("storage_set.add_target_aria", "Add Target Storage")
                : t("storage_set.add_source_aria", "Add Source Storage")
            }
          >
            {buttonLabel}
          </Button>
        </div>

        {loading && !loaded ? (
          <div className={rootClass.elem("empty")}>
            <Spinner size={32} />
          </div>
        ) : storagesLoaded && storages.length === 0 ? null : (
          storages?.map?.((storage) => (
            <StorageCard
              key={storage.id}
              storage={storage}
              target={target}
              rootClass={rootClass}
              storageTypes={storageTypes}
              onEditStorage={onEditStorage}
              onDeleteStorage={onDeleteStorage}
            />
          ))
        )}
      </Columns.Column>
    );
  },
);
