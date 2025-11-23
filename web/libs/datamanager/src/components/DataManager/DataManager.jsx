import { inject, observer } from "mobx-react";
import { useCallback } from "react";
import { Draggable } from "react-beautiful-dnd";
import { cn } from "../../utils/bem";
import { Interface } from "../Common/Interface";
import { Space } from "../Common/Space/Space";
import { Spinner } from "../Common/Spinner";
import { Tabs, TabsItem } from "../Common/Tabs/Tabs";
import { FiltersSidebar } from "../Filters/FiltersSidebar/FilterSidebar";
import { DataView } from "../MainView";
import "./DataManager.scss";
import { Toolbar } from "./Toolbar/Toolbar";
// 1. 引入 i18next
import i18next from "i18next";

const tabContentCN = cn("tabs-dm-content");

const injector = inject(({ store }) => {
  const { sidebarEnabled, sidebarVisible } = store.viewsStore ?? {};

  return {
    shrinkWidth: sidebarEnabled && sidebarVisible,
  };
});

const summaryInjector = inject(({ store }) => {
  const { project, taskStore } = store;

  return {
    totalTasks: project?.task_count ?? project?.task_number ?? 0,
    totalFoundTasks: taskStore?.total ?? 0,
    totalAnnotations: taskStore?.totalAnnotations ?? 0,
    totalPredictions: taskStore?.totalPredictions ?? 0,
    cloudSync: project.target_syncing ?? project.source_syncing ?? false,
  };
});

const switchInjector = inject(({ store }) => {
  return {
    sdk: store.SDK,
    views: store.viewsStore,
    tabs: Array.from(store.viewsStore?.all ?? []),
    selectedKey: store.viewsStore?.selected?.key,
  };
});

const ProjectSummary = summaryInjector((props) => {
  return (
    <Space size="large" style={{ paddingRight: "1em", color: "var(--color-neutral-content-subtle)" }}>
      {props.cloudSync && (
        <Space size="small" style={{ fontSize: 12, fontWeight: 400, opacity: 0.8 }}>
          {/* 2. 汉化 "Storage sync" */}
          {i18next.t("data_manager.summary.storage_sync", "Storage sync")}
          <Spinner size="small" />
        </Space>
      )}
      <span style={{ display: "flex", alignItems: "center", fontSize: 12 }}>
        <Space size="compact">
          <span>
            {/* 3. 汉化 "Tasks" 和 Tooltips */}
            {i18next.t("data_manager.summary.tasks", "Tasks")}:{" "}
            <span title={i18next.t("data_manager.summary.tooltips.filtered_tasks", "Filtered tasks")}>
              {props.totalFoundTasks}
            </span>{" "}
            /{" "}
            <span title={i18next.t("data_manager.summary.tooltips.total_tasks", "Total tasks in the project")}>
              {props.totalTasks}
            </span>
          </span>
          <span>
            {/* 4. 汉化 "Submitted annotations" */}
            {i18next.t("data_manager.summary.submitted_annotations", "Submitted annotations")}: {props.totalAnnotations}
          </span>
          <span>
            {/* 5. 汉化 "Predictions" */}
            {i18next.t("data_manager.summary.predictions", "Predictions")}: {props.totalPredictions}
          </span>
        </Space>
      </span>
    </Space>
  );
});

const TabsSwitch = switchInjector(
  observer(({ sdk, views, tabs, selectedKey }) => {
    const editable = sdk.tabControls;

    const onDragEnd = useCallback((result) => {
      if (!result.destination) {
        return;
      }

      views.updateViewOrder(result.source.index, result.destination.index);
    }, []);

    return (
      <Tabs
        activeTab={selectedKey}
        onAdd={() => views.addView({ reload: false })}
        onChange={(key) => views.setSelected(key)}
        onDragEnd={onDragEnd}
        tabBarExtraContent={<ProjectSummary />}
        allowedActions={editable}
      >
        {tabs.map((tab, index) => (
          <Draggable key={tab.key} draggableId={tab.key} index={index}>
            {(provided, snapshot) => (
              <div
                className={tabContentCN.elem("draggable").toString()}
                ref={provided.innerRef}
                {...provided.draggableProps}
                {...provided.dragHandleProps}
                style={{
                  background: snapshot.isDragging,
                  ...provided.draggableProps.style,
                }}
              >
                <TabsItem
                  key={tab.key}
                  tab={tab.key}
                  title={tab.title}
                  onFinishEditing={(title) => {
                    tab.setTitle(title);
                    tab.save();
                  }}
                  onDuplicate={() => views.duplicateView(tab)}
                  onClose={() => views.deleteView(tab)}
                  onSave={() => tab.virtual && tab.saveVirtual()}
                  active={tab.key === selectedKey}
                  editable={tab.editable}
                  deletable={tab.deletable}
                  virtual={tab.virtual}
                />
              </div>
            )}
          </Draggable>
        ))}
      </Tabs>
    );
  }),
);

export const DataManager = injector(({ shrinkWidth }) => {
  return (
    <div className={tabContentCN.toString()}>
      <div className={tabContentCN.elem("tab").mod({ shrink: shrinkWidth }).toString()}>
        <Interface name="tabs">
          <TabsSwitch />
        </Interface>

        <Interface name="toolbar">
          <Toolbar />
        </Interface>

        <DataView />
      </div>
      <FiltersSidebar />
    </div>
  );
});
