import { inject, observer } from "mobx-react";
import { RadioGroup } from "../../Common/RadioGroup/RadioGroup";
import { IconGrid, IconList } from "@humansignal/icons";
import { Tooltip } from "@humansignal/ui";
// 1. 引入 i18next
import i18next from "i18next";

const viewInjector = inject(({ store }) => ({
  view: store.currentView,
}));

export const ViewToggle = viewInjector(
  observer(({ view, size, ...rest }) => {
    return (
      <RadioGroup
        size={size}
        value={view.type}
        onChange={(e) => view.setType(e.target.value)}
        {...rest}
        style={{ "--button-padding": "0 var(--spacing-tighter)" }}
      >
        {/* 2. 汉化 List View */}
        <Tooltip title={i18next.t("data_manager.list_view", "List view")}>
          <div>
            <RadioGroup.Button
              value="list"
              aria-label={i18next.t("data_manager.list_view", "List view")}
            >
              <IconList />
            </RadioGroup.Button>
          </div>
        </Tooltip>

        {/* 3. 汉化 Grid View */}
        <Tooltip title={i18next.t("data_manager.grid_view", "Grid view")}>
          <div>
            <RadioGroup.Button
              value="grid"
              aria-label={i18next.t("data_manager.grid_view", "Grid view")}
            >
              <IconGrid />
            </RadioGroup.Button>
          </div>
        </Tooltip>
      </RadioGroup>
    );
  }),
);

export const DataStoreToggle = viewInjector(({ view, size, ...rest }) => {
  return (
    <RadioGroup value={view.target} size={size} onChange={(e) => view.setTarget(e.target.value)} {...rest}>
      {/* 4. 汉化 Tasks */}
      <RadioGroup.Button value="tasks">
        {i18next.t("data_manager.tasks", "Tasks")}
      </RadioGroup.Button>

      {/* 5. 汉化 Annotations */}
      <RadioGroup.Button value="annotations" disabled>
        {i18next.t("data_manager.annotations", "Annotations")}
      </RadioGroup.Button>
    </RadioGroup>
  );
});
