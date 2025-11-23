import { inject } from "mobx-react";
import { IconChevronLeft } from "@humansignal/icons";
import { cn } from "../../../utils/bem";
import { Button } from "@humansignal/ui";
import { Filters } from "../Filters";
import "./FilterSidebar.scss";
import { useTranslation } from "react-i18next"; // 1. 引入翻译钩子

const sidebarInjector = inject(({ store }) => {
  const viewsStore = store.viewsStore;

  return {
    viewsStore,
    sidebarEnabled: viewsStore?.sidebarEnabled,
    sidebarVisible: viewsStore?.sidebarVisible,
  };
});

export const FiltersSidebar = sidebarInjector(({ viewsStore, sidebarEnabled, sidebarVisible }) => {
  const { t } = useTranslation(); // 2. 初始化翻译

  return sidebarEnabled && sidebarVisible ? (
    <div className={cn("filters-sidebar").toClassName()}>
      <div className={cn("filters-sidebar").elem("header").toClassName()}>
        <div className={cn("filters-sidebar").elem("extra").toClassName()}>
          <Button
            look="string"
            onClick={() => viewsStore.collapseFilters()}
            tooltip={t("filters.unpin", "Unpin filters")} // 3. 汉化 Tooltip
            aria-label={t("filters.unpin", "Unpin filters")} // 4. 汉化 aria-label
          >
            <IconChevronLeft width={24} height={24} />
          </Button>
          {/* 5. 汉化标题 */}
          <div className={cn("filters-sidebar").elem("title").toClassName()}>
            {t("filters.title", "Filters")}
          </div>
        </div>
      </div>
      <Filters sidebar={true} />
    </div>
  ) : null;
});
FiltersSidebar.displayName = "FiltersSidebar";
