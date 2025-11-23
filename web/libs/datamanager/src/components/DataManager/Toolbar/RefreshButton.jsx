import { inject } from "mobx-react";
import { IconRefresh } from "@humansignal/icons";
import { Button } from "@humansignal/ui";
// 1. 引入 i18next
import i18next from "i18next";

const injector = inject(({ store }) => {
  return {
    store,
    needsDataFetch: store.needsDataFetch,
    projectFetch: store.projectFetch,
  };
});

export const RefreshButton = injector(({ store, needsDataFetch, projectFetch, size, style, ...rest }) => {
  return (
    <Button
      size={size ?? "small"}
      look={needsDataFetch ? "filled" : "outlined"}
      variant={needsDataFetch ? "primary" : "neutral"}
      waiting={projectFetch}
      // 2. 汉化 Aria Label
      aria-label={i18next.t("data_manager.refresh", "Refresh data")}
      onClick={async () => {
        await store.fetchProject({ force: true, interaction: "refresh" });
        await store.currentView?.reload();
      }}
    >
      <IconRefresh />
    </Button>
  );
});
