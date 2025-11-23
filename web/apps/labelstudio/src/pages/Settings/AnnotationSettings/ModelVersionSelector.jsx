import { useCallback, useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next"; // 导入 i18n hook
import { useAPI } from "../../../providers/ApiProvider";
import { Select } from "../../../components/Form";
import { ProjectContext } from "../../../providers/ProjectProvider";

export const ModelVersionSelector = ({
  name = "model_version",
  valueName = "model_version",
  apiName = "projectModelVersions",
  ...props
}) => {
  const { t } = useTranslation(); // 初始化 t 函数
  const api = useAPI();
  const { project } = useContext(ProjectContext);
  const [loading, setLoading] = useState(true);
  const [versions, setVersions] = useState([]);
  const [models, setModels] = useState([]);
  const [version, setVersion] = useState(null);
  const [placeholder, setPlaceholder] = useState("");

  useEffect(() => {
    setVersion(project?.[valueName] || null);
  }, [project?.[valueName], versions]);

  const fetchMLVersions = useCallback(async () => {
    const pk = project?.id;

    if (!pk) return;

    const modelVersions = await api.callApi(apiName, {
      params: {
        pk,
        extended: true,
        include_live_models: true,
      },
    });

    if (modelVersions?.live?.length > 0) {
      const liveModels = modelVersions.live.map((item) => {
        const label = `${item.title} (${item.readable_state})`;

        return {
          group: t("model_version_selector.group_models", "Models"),
          value: item.title,
          label,
        };
      });

      setModels(liveModels);
    }

    if (modelVersions?.static?.length > 0) {
      const staticModels = modelVersions.static.map((item) => {
        // 使用 t 函数处理复数形式
        const label = `${item.model_version} (${item.count} ${t("common.predictions", { count: item.count })})`;

        return {
          group: t("model_version_selector.group_predictions", "Predictions"),
          value: item.model_version,
          label,
        };
      });

      setVersions(staticModels);
    }

    if (!modelVersions?.static?.length && !modelVersions?.live?.length) {
      setPlaceholder(t("model_version_selector.no_models_placeholder", "No model or predictions available"));
    }

    setLoading(false);
  }, [project?.id, apiName, t]); // 将 t 添加到依赖项数组

  useEffect(() => {
    fetchMLVersions();
  }, [fetchMLVersions]);

  return (
    <div>
      <label>{t("model_version_selector.label", "Select which predictions or which model you want to use:")}</label>
      <div style={{ display: "flex", alignItems: "center", width: 400 }}>
        <div style={{ flex: 1, paddingRight: 16 }}>
          <Select
            name={name}
            disabled={!versions.length && !models.length}
            value={version}
            onChange={setVersion}
            options={[...models, ...versions]}
            placeholder={placeholder || t("model_version_selector.select_placeholder", "Please select model or predictions")}
            isInProgress={loading}
            {...props}
          />
        </div>
      </div>
    </div>
  );
};
