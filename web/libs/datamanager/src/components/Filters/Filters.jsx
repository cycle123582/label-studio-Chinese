import { inject } from "mobx-react";
import React from "react";
import { cn } from "../../utils/bem";
import { Button } from "@humansignal/ui";
import { FilterLine } from "./FilterLine/FilterLine";
import { IconChevronRight, IconPlus } from "@humansignal/icons";
import "./Filters.scss";
import { useTranslation } from "react-i18next"; // 1. 引入翻译钩子

const injector = inject(({ store }) => ({
  store,
  views: store.viewsStore,
  currentView: store.currentView,
  filters: store.currentView?.currentFilters ?? [],
}));

export const Filters = injector(({ views, currentView, filters }) => {
  const { t } = useTranslation(); // 2. 初始化翻译
  const { sidebarEnabled } = views;

  const fields = React.useMemo(
    () =>
      currentView.availableFilters.reduce((res, filter) => {
        const target = filter.field.target;
        const groupTitle = target
          .split("_")
          .map((s) =>
            s
              .split("")
              .map((c, i) => (i === 0 ? c.toUpperCase() : c))
              .join(""),
          )
          .join(" ");

        const group = res[target] ?? {
          id: target,
          // 这里的 groupTitle (如 Tasks, Annotations) 也可以尝试汉化，但属于后端字段名，暂时保留原样或使用 t(groupTitle)
          title: groupTitle,
          options: [],
        };

        group.options.push({
          value: filter.id,
          title: filter.field.title,
          original: filter,
        });

        return { ...res, [target]: group };
      }, {}),
    [currentView.availableFilters],
  );

  return (
    <div className={cn("filters").mod({ sidebar: sidebarEnabled }).toClassName()}>
      <div className={cn("filters").elem("list").mod({ withFilters: !!filters.length }).toClassName()}>
        {filters.length ? (
          filters.map((filter, i) => (
            <FilterLine
              index={i}
              filter={filter}
              view={currentView}
              sidebar={sidebarEnabled}
              value={filter.currentValue}
              key={`${filter.filter.id}-${i}`}
              availableFilters={Object.values(fields)}
              dropdownClassName={cn("filters").elem("selector").toClassName()}
            />
          ))
        ) : (
          // 3. 汉化 "No filters applied"
          <div className={cn("filters").elem("empty").toClassName()}>
            {t("filters.empty", "No filters applied")}
          </div>
        )}
      </div>
      <div className={cn("filters").elem("actions").toClassName()}>
        <Button
          size="small"
          look="string"
          onClick={() => currentView.createFilter()}
          leading={<IconPlus className="!h-3 !w-3" />}
        >
          {/* 4. 汉化按钮文本 */}
          {filters.length
            ? t("filters.add_another_filter", "Add Another Filter")
            : t("filters.add_filter", "Add Filter")
          }
        </Button>

        {!sidebarEnabled ? (
          <Button
            look="string"
            type="link"
            size="small"
            // 5. 汉化 Tooltip
            tooltip={t("filters.pin", "Pin to sidebar")}
            onClick={() => views.expandFilters()}
            // 6. 汉化 aria-label
            aria-label={t("filters.pin", "Pin filters to sidebar")}
          >
            <IconChevronRight className="!w-4 !h-4" />
          </Button>
        ) : null}
      </div>
    </div>
  );
});
