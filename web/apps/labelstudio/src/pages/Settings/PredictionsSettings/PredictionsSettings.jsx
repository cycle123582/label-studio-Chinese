import { useCallback, useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next"; // 导入 i18n hook
import { Divider } from "../../../components/Divider/Divider";
import { EmptyState, SimpleCard } from "@humansignal/ui";
import { IconPredictions, Typography, IconExternal } from "@humansignal/ui";
import { useUpdatePageTitle, createTitleFromSegments } from "@humansignal/core";
import { useAPI } from "../../../providers/ApiProvider";
import { ProjectContext } from "../../../providers/ProjectProvider";
import { Spinner } from "../../../components/Spinner/Spinner";
import { PredictionsList } from "./PredictionsList";
import i18next from "i18next";

export const PredictionsSettings = () => {
  const { t } = useTranslation(); // 初始化 t 函数
  const api = useAPI();
  const { project } = useContext(ProjectContext);
  const [versions, setVersions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useUpdatePageTitle(createTitleFromSegments([project?.title, t("predictions_settings.page_title", "Predictions Settings")]));

  const fetchVersions = useCallback(async () => {
    if (!project?.id) return;
    setLoading(true);
    const versions = await api.callApi("projectModelVersions", {
      params: {
        pk: project.id,
        extended: true,
      },
    });

    if (versions) setVersions(versions.static);
    setLoading(false);
    setLoaded(true);
  }, [project, api]); // 移除了 setVersions

  useEffect(() => {
    if (project.id) {
      fetchVersions();
    }
  }, [project, fetchVersions]);

  return (
    <section className="max-w-[42rem]">
      <Typography variant="headline" size="medium" className="mb-tight">
        {t("predictions_settings.section_title", "Predictions")}
      </Typography>
      <div>
        {loading && <Spinner size={32} />}

        {loaded && versions.length > 0 && (
          <>
            <Typography variant="title" size="medium">
              {t("predictions_settings.list_title", "Predictions List")}
            </Typography>
            <Typography size="small" className="text-neutral-content-subtler mt-base mb-wider">
              {t("predictions_settings.list_desc_part1", "List of predictions available in the project. Each card is associated with a separate model version. To learn about how to import predictions,")}{" "}
              <a href="https://labelstud.io/guide/predictions.html" target="_blank" rel="noreferrer">
                {t("predictions_settings.list_desc_part2", "see the documentation")}
              </a>
              .
            </Typography>
          </>
        )}

        {loaded && versions.length === 0 && (
          <SimpleCard title="" className="bg-primary-background border-primary-border-subtler p-base">
            <EmptyState
              size="medium"
              variant="primary"
              icon={<IconPredictions />}
              title={t("predictions_settings.empty_title", "No predictions uploaded yet")}
              description={t(
                "predictions_settings.empty_desc",
                "Upload predictions to automatically prelabel your data and speed up annotation. Import predictions from multiple model versions to compare their performance, or connect live models from the Model page to generate predictions on demand.",
              )}
              footer={
                !window.APP_SETTINGS?.whitelabel_is_active && (
                  <Typography variant="label" size="small" className="text-primary-link">
                    <a
                      href="https://labelstud.io/guide/predictions"
                      target="_blank"
                      rel="noopener noreferrer"
                      data-testid="predictions-help-link"
                      aria-label={t("predictions_settings.empty_learn_more_aria", "Learn more about predictions (opens in new window)")}
                      className="inline-flex items-center gap-1 hover:underline"
                    >
                      {t("common.learn_more", "Learn more")}
                      <IconExternal width={16} height={16} />
                    </a>
                  </Typography>
                )
              }
            />
          </SimpleCard>
        )}

        <PredictionsList project={project} versions={versions} fetchVersions={fetchVersions} />

        <Divider height={32} />
      </div>
    </section>
  );
};

// 将静态 title 改为一个翻译键
PredictionsSettings.title = i18next.t("predictions_settings.menu_title");
PredictionsSettings.path = "/predictions";
