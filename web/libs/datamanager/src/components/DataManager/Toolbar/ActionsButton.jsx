import { IconChevronDown, IconChevronRight, IconTrash } from "@humansignal/icons";
import { Button, Spinner, Tooltip } from "@humansignal/ui";
import { inject, observer } from "mobx-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useActions } from "../../../hooks/useActions";
import { cn } from "../../../utils/bem";
import { FF_LOPS_E_3, isFF } from "../../../utils/feature-flags";
// 1. 修复引用：Dropdown 必须是默认导入 (无花括号)
import { Dropdown } from "../../Common/Dropdown/Dropdown";
import Form from "../../Common/Form/Form";
import { Menu } from "../../Common/Menu/Menu";
import { Modal } from "../../Common/Modal/ModalPopup";
import "./ActionsButton.scss";

const isFFLOPSE3 = isFF(FF_LOPS_E_3);
const injector = inject(({ store }) => ({
  store,
  hasSelected: store.currentView?.selected?.hasSelected ?? false,
}));

// === 硬编码翻译字典 (菜单项) ===
const ACTION_DICT = {
  retrieve_tasks_predictions: "获取预测",
  delete_tasks: "删除任务",
  delete_tasks_annotations: "删除标注",
  delete_tasks_predictions: "删除预测",
  predictions_to_annotations: "从预测创建标注",
  remove_duplicates: "删除重复任务",
  export_tasks: "导出任务"
};

const DialogContent = ({ text, form, formRef, store, action }) => {
  const [formData, setFormData] = useState(form);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!formData) {
      setIsLoading(true);
      store
        .fetchActionForm(action.id)
        .then((form) => {
          setFormData(form);
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, [formData, store, action.id]);

  const fields = formData?.toJSON ? formData.toJSON() : formData;

  return (
    <div className={cn("dialog-content").toClassName()}>
      <div className={cn("dialog-content").elem("text").toClassName()}>{text}</div>
      {isLoading && (
        <div
          className={cn("dialog-content").elem("loading").toClassName()}
          style={{ display: "flex", justifyContent: "center", marginTop: 16 }}
        >
          <Spinner />
        </div>
      )}
      {formData && (
        <div className={cn("dialog-content").elem("form").toClassName()} style={{ paddingTop: 16 }}>
          <Form.Builder ref={formRef} fields={fields} autosubmit={false} withActions={false} />
        </div>
      )}
    </div>
  );
};

const ActionButton = ({ action, parentRef, store, formRef }) => {
  const isDeleteAction = action.id.includes("delete");
  const hasChildren = !!action.children?.length;
  const submenuRef = useRef();

  const onClick = useCallback(
    (e) => {
      e.preventDefault();
      if (action.disabled) return;
      action?.callback
        ? action?.callback(store.currentView?.selected?.snapshot, action)
        : invokeAction(action, isDeleteAction, store, formRef);
      parentRef?.current?.close?.();
    },
    [store.currentView?.selected, action, isDeleteAction, parentRef, store, formRef],
  );

  // 2. 获取汉化后的标题，如果没有定义则显示原标题
  const displayTitle = ACTION_DICT[action.id] || action.title;

  const titleContainer = (
    <Menu.Item
      key={action.id}
      className={cn("actionButton")
        .mod({
          hasSeperator: isDeleteAction,
          hasSubMenu: action.children?.length > 0,
          isSeparator: action.isSeparator,
          isTitle: action.isTitle,
          danger: isDeleteAction,
          disabled: action.disabled,
        })
        .toClassName()}
      size="small"
      onClick={onClick}
      aria-label={displayTitle}
    >
      <div
        className={cn("actionButton").elem("titleContainer").toClassName()}
        {...(action.disabled ? { title: action.disabledReason } : {})}
      >
        <div className={cn("actionButton").elem("title").toClassName()}>{displayTitle}</div>
        {hasChildren ? <IconChevronRight className={cn("actionButton").elem("icon").toClassName()} /> : null}
      </div>
    </Menu.Item>
  );

  if (hasChildren) {
    return (
      <Dropdown.Trigger
        key={action.id}
        align="top-right-outside"
        toggle={false}
        ref={submenuRef}
        content={
          <ul className={cn("actionButton-submenu").toClassName()}>
            {action.children.map((childAction) => (
              <ActionButton
                key={childAction.id}
                action={childAction}
                parentRef={parentRef}
                store={store}
                formRef={formRef}
              />
            ))}
          </ul>
        }
      >
        {titleContainer}
      </Dropdown.Trigger>
    );
  }

  return (
    <Tooltip key={action.id} title={action.disabled_reason} disabled={!action.disabled} alignment="bottom-center">
      <div>
        <Menu.Item
          size="small"
          key={action.id}
          variant={isDeleteAction ? "negative" : undefined}
          onClick={onClick}
          className={`actionButton${action.isSeparator ? "_isSeparator" : action.isTitle ? "_isTitle" : ""} ${
            action.disabled ? "actionButton_disabled" : ""
          }`}
          icon={isDeleteAction && <IconTrash />}
          title={action.disabled ? action.disabledReason : null}
          aria-label={displayTitle}
        >
          {displayTitle}
        </Menu.Item>
      </div>
    </Tooltip>
  );
};

const invokeAction = (action, destructive, store, formRef) => {
  if (action.dialog) {
    const { type: dialogType, text, form, title } = action.dialog;
    const dialog = Modal[dialogType] ?? Modal.confirm;

    // 3. 弹窗内容的硬编码汉化逻辑
    let dialogTitle = title;
    let dialogText = text;
    let okButtonText = "确定";

    if (destructive && !title) {
      // 针对删除操作的特殊汉化映射
      const objectMap = {
        delete_tasks: "任务",
        delete_annotations: "标注",
        delete_predictions: "预测",
        delete_reviews: "审查",
        delete_reviewers: "审查分配",
        delete_annotators: "标注分配",
        delete_ground_truths: "基准真值",
      };

      // 尝试获取对象名称，如果找不到则尝试解析英文
      const objectType = objectMap[action.id] || "选中项";

      dialogTitle = `删除选中的${objectType}？`;
      okButtonText = "删除";
    }

    if (destructive && !form) {
      // 删除操作的默认警告文本
      dialogText = `您即将删除选中的内容。\n\n此操作无法撤销，请谨慎操作。`;
    }

    // 对非删除操作的通用标题汉化（如果有英文传入）
    if (!destructive && dialogTitle === "Retrieve Predictions") {
        dialogTitle = "获取预测";
    }

    dialog({
      title: dialogTitle ? dialogTitle : destructive ? "危险操作" : "确认操作",
      body: <DialogContent text={dialogText} form={form} formRef={formRef} store={store} action={action} />,
      buttonLook: destructive ? "negative" : "primary",
      okText: destructive ? okButtonText : "确定",
      cancelText: "取消", // 显式设置取消按钮中文
      onOk() {
        const body = formRef.current?.assembleFormData({ asJSON: true });

        store.SDK.invoke("actionDialogOk", action.id, { body });
        store.invokeAction(action.id, { body });
      },
      closeOnClickOutside: false,
    });
  } else {
    store.invokeAction(action.id);
  }
};

export const ActionsButton = injector(
  observer(({ store, size, hasSelected, ...rest }) => {
    const formRef = useRef();
    const selectedCount = store.currentView.selectedCount;
    const [isOpen, setIsOpen] = useState(false);

    const {
      actions: serverActions,
      isLoading,
      isFetching,
    } = useActions({
      enabled: isOpen,
      projectId: store.SDK.projectId,
    });

    const actions = useMemo(() => {
      return [...store.availableActions, ...serverActions].filter((a) => !a.hidden).sort((a, b) => a.order - b.order);
    }, [store.availableActions, serverActions]);
    const actionButtons = actions.map((action) => (
      <ActionButton key={action.id} action={action} parentRef={formRef} store={store} formRef={formRef} />
    ));

    // 4. 主按钮汉化
    return (
      <Dropdown.Trigger
        content={
          <Menu size="compact">
            {isLoading || isFetching ? (
              <Menu.Item data-testid="loading-actions" disabled>
                加载操作中...
              </Menu.Item>
            ) : (
              actionButtons
            )}
          </Menu>
        }
        openUpwardForShortViewport={false}
        disabled={!hasSelected}
        onToggle={setIsOpen}
      >
        <Button
          size={size}
          variant="neutral"
          look="outlined"
          disabled={!hasSelected}
          trailing={<IconChevronDown />}
          aria-label="Tasks Actions"
          {...rest}
        >
          {selectedCount > 0 ? `已选 ${selectedCount} 项` : "操作"}
        </Button>
      </Dropdown.Trigger>
    );
  }),
);
