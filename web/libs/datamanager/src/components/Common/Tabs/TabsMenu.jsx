import { useMemo } from "react";
// 1. 引入 i18n hook
import { useTranslation } from "react-i18next";
import { Menu } from "../Menu/Menu";

export const TabsMenu = ({ onClick, editable = true, closable = true, clonable = true, virtual = false }) => {
  // 2. 获取 t 函数
  const { t } = useTranslation();

  const items = useMemo(
    () => [
      {
        key: "edit",
        // 3. 汉化 "Rename"
        title: t("tabs_menu.rename", "Rename"),
        enabled: editable && !virtual,
        action: () => onClick("edit"),
      },
      {
        key: "duplicate",
        // 4. 汉化 "Duplicate"
        title: t("tabs_menu.duplicate", "Duplicate"),
        enabled: !virtual && clonable,
        action: () => onClick("duplicate"),
        willLeave: true,
      },
      {
        key: "save",
        // 5. 汉化 "Save"
        title: t("tabs_menu.save", "Save"),
        enabled: virtual,
        action: () => onClick("save"),
        willLeave: true,
      },
    ],
    // 6. 关键：必须把 't' 加入依赖数组，否则切换语言菜单不变
    [editable, closable, clonable, virtual, t],
  );

  const showDivider = useMemo(() => closable && items.some(({ enabled }) => enabled), [items, closable]);

  return (
    <Menu size="medium" onClick={(e) => e.domEvent.stopPropagation()}>
      {items.map((item) =>
        item.enabled ? (
          <Menu.Item key={item.key} onClick={item.action} data-leave={item.willLeave}>
            {item.title}
          </Menu.Item>
        ) : null,
      )}

      {closable ? (
        <>
          {showDivider && <Menu.Divider />}
          <Menu.Item onClick={() => onClick("close")} data-leave>
            {/* 7. 汉化 "Close" */}
            {t("tabs_menu.close", "Close")}
          </Menu.Item>
        </>
      ) : null}
    </Menu>
  );
};
