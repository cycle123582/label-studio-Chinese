import { useCallback, useMemo, useState } from "react";
import { useTranslation } from "react-i18next"; // 导入 i18n hook
import { useUpdatePageTitle, createTitleFromSegments } from "@humansignal/core";
import { useAPI } from "../../providers/ApiProvider";
import { useProject } from "../../providers/ProjectProvider";
import { FF_UNSAVED_CHANGES, isFF } from "../../utils/feature-flags";
import { isEmptyString } from "../../utils/helpers";
import { ConfigPage } from "../CreateProject/Config/Config";
import i18next from "i18next";

export const LabelingSettings = () => {
  const { t } = useTranslation(); // 初始化 t 函数
  const { project, fetchProject, updateProject } = useProject();
  const [config, setConfig] = useState("");
  const [essentialDataChanged, setEssentialDataChanged] = useState(false);
  const hasChanges = isFF(FF_UNSAVED_CHANGES) && config !== project.label_config;
  const api = useAPI();

  useUpdatePageTitle(createTitleFromSegments([project?.title, t("labeling_settings.page_title", "Labeling Interface Settings")]));

  const saveConfig = useCallback(
    isFF(FF_UNSAVED_CHANGES)
      ? async () => {
          const res = await updateProject({
            label_config: config,
          });

          if (res?.$meta?.ok) {
            setConfig(res.label_config);
            return true;
          }
          return res.response;
        }
      : async () => {
          const res = await api.callApi("updateProjectRaw", {
            params: {
              pk: project.id,
            },
            body: {
              label_config: config,
            },
          });

          if (res.ok) {
            return true;
          }
          const error = await res.json();
          fetchProject();
          return error;
        },
    [project, config, updateProject, api, fetchProject], // 更新依赖项
  );

  const projectAlreadySetUp = useMemo(() => {
    // ... (逻辑不变)
  }, [project]);

  const onSave = useCallback(async () => {
    return saveConfig();
  }, [saveConfig]);

  const onUpdate = useCallback(
    (config) => {
      setConfig(config);
      fetchProject();
    },
    [fetchProject],
  );

  const onValidate = useCallback((validation) => {
    setEssentialDataChanged(validation.config_essential_data_has_changed);
  }, []);

  if (!project.id) return null;

  return (
    <ConfigPage
      config={project.label_config}
      project={project}
      onUpdate={onUpdate}
      onSaveClick={onSave}
      onValidate={onValidate}
      hasChanges={hasChanges}
    />
  );
};

// 将静态 title 改为一个翻译键
LabelingSettings.title = i18next.t("labeling_settings.menu_title");
LabelingSettings.path = "/labeling";
