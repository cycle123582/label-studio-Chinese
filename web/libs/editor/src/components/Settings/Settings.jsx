import React, { useMemo } from "react";
import { Modal, Table, Tabs } from "antd";
import { observer } from "mobx-react";

import { Hotkey } from "../../core/Hotkey";

import "./Settings.scss";
import { cn } from "../../utils/bem";
import { triggerResizeEvent } from "../../utils/utilities";

import EditorSettings from "../../core/settings/editorsettings";
import * as TagSettings from "./TagSettings";
import { IconClose } from "@humansignal/icons";
import { Checkbox, Toggle } from "@humansignal/ui";
import { FF_DEV_3873, isFF } from "../../utils/feature-flags";
import { ff } from "@humansignal/core";
import { useTranslation } from "react-i18next"; // 1. 引入翻译钩子

const HotkeysDescription = () => {
  const { t } = useTranslation(); // 2. 初始化翻译

  const columns = [
    { title: t("hotkeys.shortcut", "Shortcut"), dataIndex: "combo", key: "combo" }, // 3. 汉化 Shortcut
    { title: t("hotkeys.description", "Description"), dataIndex: "descr", key: "descr" }, // 4. 汉化 Description
  ];

  const keyNamespaces = Hotkey.namespaces();

  const getData = (descr) =>
    Object.keys(descr)
      .filter((k) => descr[k])
      .map((k) => ({
        key: k,
        combo: k.split(",").map((keyGroup) => {
          return (
            <div className={cn("keys").elem("key-group").toClassName()} key={keyGroup}>
              {keyGroup
                .trim()
                .split("+")
                .map((k) => (
                  <kbd className={cn("keys").elem("key").toClassName()} key={k}>
                    {k}
                  </kbd>
                ))}
            </div>
          );
        }),
        descr: descr[k],
      }));

  return (
    <div className={cn("keys").toClassName()}>
      <Tabs size="small">
        {Object.entries(keyNamespaces).map(([ns, data]) => {
          if (Object.keys(data.descriptions).length === 0) {
            return null;
          }
          return (
            // 注意：ns 是命名空间 Key (如 'Image', 'General')，通常需要通过 t(`hotkeys.${ns}`) 来翻译，这里 data.description 可能是后端/配置返回的，如果没有多语言支持，可能仍显示英文
            // 建议尝试 t(`hotkeys.${ns}`, data.description ?? ns)
            <Tabs.TabPane key={ns} tab={t(`hotkeys.${ns}`, data.description ?? ns)}>
              <Table columns={columns} dataSource={getData(data.descriptions)} size="small" />
            </Tabs.TabPane>
          );
        })}
      </Tabs>
    </div>
  );
};

const newUI = isFF(FF_DEV_3873) ? { newUI: true } : {};

const editorSettingsKeys = Object.keys(EditorSettings).filter((key) => {
  const flag = EditorSettings[key].flag;
  return flag ? ff.isActive(flag) : true;
});

if (isFF(FF_DEV_3873)) {
  const enableTooltipsIndex = editorSettingsKeys.findIndex((key) => key === "enableTooltips");
  const enableLabelTooltipsIndex = editorSettingsKeys.findIndex((key) => key === "enableLabelTooltips");

  // swap these in the array
  const tmp = editorSettingsKeys[enableTooltipsIndex];

  editorSettingsKeys[enableTooltipsIndex] = editorSettingsKeys[enableLabelTooltipsIndex];
  editorSettingsKeys[enableLabelTooltipsIndex] = tmp;
}

const SettingsTag = ({ children }) => {
  return <div className={cn("settings-tag").toClassName()}>{children}</div>;
};

const GeneralSettings = observer(({ store }) => {
  // EditorSettings 的内容是在 editorsettings.js 中定义的，如果你已经在那里进行了汉化（替换了 title/description），这里会自动显示中文。
  // 如果 editorsettings.js 还是英文，你需要去修改那个文件，或者在这里拦截并翻译 (不推荐，因为 key 太多)。
  // 假设你已经在 editorsettings.js 做了汉化。

  return (
    <div className={cn("settings").mod(newUI).toClassName()}>
      {editorSettingsKeys.map((obj, index) => {
        return (
          <label className={cn("settings").elem("field").toClassName()} key={index}>
            {isFF(FF_DEV_3873) ? (
              <>
                <div className={cn("settings__label").toClassName()}>
                  <div className={cn("settings__label").elem("title").toClassName()}>
                    {EditorSettings[obj].newUI.title}
                    {EditorSettings[obj].newUI.tags?.split(",").map((tag) => (
                      <SettingsTag key={tag}>{tag}</SettingsTag>
                    ))}
                  </div>
                  <div className={cn("settings__label").elem("description").toClassName()}>
                    {EditorSettings[obj].newUI.description}
                  </div>
                </div>
                <Toggle
                  key={index}
                  checked={store.settings[obj]}
                  onChange={store.settings[EditorSettings[obj].onChangeEvent]}
                  description={EditorSettings[obj].description}
                />
              </>
            ) : (
              <>
                <Checkbox
                  key={index}
                  checked={store.settings[obj]}
                  onChange={store.settings[EditorSettings[obj].onChangeEvent]}
                >
                  {EditorSettings[obj].description}
                </Checkbox>
                <br />
              </>
            )}
          </label>
        );
      })}
    </div>
  );
});

const LayoutSettings = observer(({ store }) => {
  const { t } = useTranslation();
  return (
    <div className={cn("settings").mod(newUI).toClassName()}>
      <div className={cn("settings").elem("field").toClassName()}>
        <Checkbox
          checked={store.settings.bottomSidePanel}
          onChange={() => {
            store.settings.toggleBottomSP();
            setTimeout(triggerResizeEvent);
          }}
        >
          {t("settings_modal.layout.move_bottom", "Move sidepanel to the bottom")}
        </Checkbox>
      </div>

      <div className={cn("settings").elem("field").toClassName()}>
        <Checkbox checked={store.settings.displayLabelsByDefault} onChange={store.settings.toggleSidepanelModel}>
          {t("settings_modal.layout.display_labels", "Display Labels by default in Results panel")}
        </Checkbox>
      </div>

      <div className={cn("settings").elem("field").toClassName()}>
        <Checkbox
          value="Show Annotations panel"
          defaultChecked={store.settings.showAnnotationsPanel}
          onChange={() => {
            store.settings.toggleAnnotationsPanel();
          }}
        >
          {t("settings_modal.layout.show_annotations", "Show Annotations panel")}
        </Checkbox>
      </div>

      <div className={cn("settings").elem("field").toClassName()}>
        <Checkbox
          value="Show Predictions panel"
          defaultChecked={store.settings.showPredictionsPanel}
          onChange={() => {
            store.settings.togglePredictionsPanel();
          }}
        >
          {t("settings_modal.layout.show_predictions", "Show Predictions panel")}
        </Checkbox>
      </div>
    </div>
  );
});

// Settings object structure needs to be inside a functional component or memoized to use hooks,
// or we can wrap the Tabs rendering logic.
// To keep changes minimal, we will translate the keys during rendering.

const Settings = {
  General: { name: "General", component: GeneralSettings },
  Hotkeys: { name: "Hotkeys", component: HotkeysDescription },
};

if (!isFF(FF_DEV_3873)) {
  Settings.Layout = { name: "Layout", component: LayoutSettings };
}

const DEFAULT_ACTIVE = Object.keys(Settings)[0];

export default observer(({ store }) => {
  const { t } = useTranslation(); // 5. 初始化翻译

  // 6. 动态设置 Modal 配置
  const modalSettings = isFF(FF_DEV_3873)
  ? {
      name: "settings-modal",
      title: t("settings_modal.title_new_ui", "Labeling Interface Settings"),
      closeIcon: <IconClose />,
    }
  : {
      name: "settings-modal-old",
      title: t("settings_modal.title", "Settings"),
      bodyStyle: { paddingTop: "0" },
    };

  const availableSettings = useMemo(() => {
    const availableTags = Object.values(store.annotationStore.names.toJSON());
    const settingsScreens = Object.values(TagSettings);

    return availableTags.reduce((res, tagName) => {
      const tagType = store.annotationStore.names.get(tagName).type;
      const settings = settingsScreens.find(({ tagName }) => tagName.toLowerCase() === tagType.toLowerCase());

      if (settings) res.push(settings);

      return res;
    }, []);
  }, []);

  return (
    <Modal
      className={cn(modalSettings.name).toClassName()}
      open={store.showingSettings}
      onCancel={store.toggleSettings}
      footer=""
      title={modalSettings.title}
      closeIcon={modalSettings.closeIcon}
      bodyStyle={modalSettings.bodyStyle}
    >
      <Tabs defaultActiveKey={DEFAULT_ACTIVE}>
        {Object.entries(Settings).map(([key, { name, component }]) => (
          <Tabs.TabPane tab={t(`settings_modal.tabs.${key.toLowerCase()}`, name)} key={key}>
            {React.createElement(component, { store })}
          </Tabs.TabPane>
        ))}
        {availableSettings.map((Page) => (
          // Page.title 通常是硬编码的（如 'Image', 'Audio'），如果需要也可以尝试 t(Page.title)
          <Tabs.TabPane tab={Page.title} key={Page.tagName}>
            <Page store={store} />
          </Tabs.TabPane>
        ))}
      </Tabs>
    </Modal>
  );
});
