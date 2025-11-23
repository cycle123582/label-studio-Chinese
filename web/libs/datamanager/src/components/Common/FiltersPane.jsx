import { inject, observer } from "mobx-react";
import React, { useEffect, useRef } from "react";
// 1. 引入 i18n hook
import { useTranslation } from "react-i18next";
import { IconChevronDown } from "@humansignal/icons";
import { Filters } from "../Filters/Filters";
import { Badge } from "./Badge/Badge";
import { Button } from "@humansignal/ui";
import { Dropdown } from "./Dropdown/Dropdown";
import { Icon } from "./Icon/Icon";

const buttonInjector = inject(({ store }) => {
  const { viewsStore, currentView } = store;

  return {
    viewsStore,
    sidebarEnabled: viewsStore?.sidebarEnabled ?? false,
    activeFiltersNumber: currentView?.filtersApplied ?? false,
  };
});

export const FiltersButton = buttonInjector(
  observer(
    React.forwardRef(({ activeFiltersNumber, size, sidebarEnabled, viewsStore, ...rest }, ref) => {
      // 2. 获取翻译函数
      const { t } = useTranslation();
      const hasFilters = activeFiltersNumber > 0;

      return (
        <Button
          ref={ref}
          size="small"
          variant="neutral"
          look="outlined"
          onClick={() => sidebarEnabled && viewsStore.toggleSidebar()}
          trailing={<Icon icon={IconChevronDown} />}
          // 3. 汉化 aria-label
          aria-label={t("data_manager.filters", "Filters")}
          {...rest}
        >
          {/* 4. 汉化显示文本 */}
          {t("data_manager.filters", "Filters")}{" "}
          {hasFilters && (
            <Badge size="small" style={{ marginLeft: 5 }}>
              {activeFiltersNumber}
            </Badge>
          )}
        </Button>
      );
    }),
  ),
);

const injector = inject(({ store }) => {
  return {
    sidebarEnabled: store?.viewsStore?.sidebarEnabled ?? false,
  };
});

export const FiltersPane = injector(
  observer(({ sidebarEnabled, size, ...rest }) => {
    const dropdown = useRef();

    useEffect(() => {
      if (sidebarEnabled === true) {
        dropdown?.current?.close();
      }
    }, [sidebarEnabled]);

    return (
      <Dropdown.Trigger
        ref={dropdown}
        disabled={sidebarEnabled}
        content={<Filters />}
        openUpwardForShortViewport={false}
        isChildValid={(ele) => {
          return !!ele.closest("[data-radix-popper-content-wrapper]");
        }}
      >
        <FiltersButton {...rest} size={size} />
      </Dropdown.Trigger>
    );
  }),
);
