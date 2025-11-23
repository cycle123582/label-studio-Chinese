import { useCopyText } from "@humansignal/core";
import { IconEllipsis, IconLink } from "@humansignal/icons";
import { Button, ToastType, useToast } from "@humansignal/ui";
import { observer } from "mobx-react";
import { type FC, useCallback, useMemo, useState } from "react";
// 1. 引入 i18n hook
import { useTranslation } from "react-i18next";
import { cn } from "../../../utils/bem";
import { ContextMenu, type ContextMenuAction, ContextMenuTrigger, type MenuActionOnClick } from "../../ContextMenu";

export const RegionContextMenu: FC<{ item: any }> = observer(({ item }: { item: any }) => {
  const [open, setOpen] = useState(false);
  // 2. 获取 t 函数
  const { t } = useTranslation();

  const regionLink = useMemo(() => {
    const url = new URL(window.location.href);
    if (item.annotation.pk) {
      url.searchParams.set("annotation", item.annotation.pk);
    }
    if (item.id) {
      url.searchParams.set("region", item.id.split("#")[0]);
    }
    return url.toString();
  }, [item]);
  const [copyLink] = useCopyText({ defaultText: regionLink });
  const toast = useToast();

  const onCopyLink = useCallback<MenuActionOnClick>(
    (_, ctx) => {
      copyLink();
      ctx.dropdown?.close();
      toast.show({
        // 3. 汉化 Toast 提示
        message: t("region.link_copied", "Region link copied to clipboard"),
        type: ToastType.info,
      });
    },
    [copyLink, t], // 添加 t 到依赖
  );

  const actions = useMemo<ContextMenuAction[]>(
    () => [
      {
        // 4. 汉化菜单选项
        label: t("region.copy_link", "Copy Region Link"),
        onClick: onCopyLink,
        icon: <IconLink />,
      },
    ],
    [onCopyLink, t], // 添加 t 到依赖
  );

  return (
    <ContextMenuTrigger
      className={cn("region-context-menu").toClassName()}
      content={<ContextMenu actions={actions} />}
      onToggle={(isOpen) => setOpen(isOpen)}
    >
      <Button
        variant="neutral"
        look="string"
        size="smaller"
        style={{ ...(open ? { display: "flex !important" } : null) }}
        // 5. 汉化无障碍标签
        aria-label={t("region.options", "Region options")}
      >
        <IconEllipsis />
      </Button>
    </ContextMenuTrigger>
  );
});
