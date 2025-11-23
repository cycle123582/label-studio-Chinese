import { useCallback, useContext, useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Button, Typography, Spinner, EmptyState, SimpleCard } from "@humansignal/ui";
import { useUpdatePageTitle, createTitleFromSegments } from "@humansignal/core";
import { Form, Label, Toggle } from "../../../components/Form";
import { modal } from "../../../components/Modal/Modal";
import { IconModels, IconExternal } from "@humansignal/icons";
import { useAPI } from "../../../providers/ApiProvider";
import { ProjectContext } from "../../../providers/ProjectProvider";
import { MachineLearningList } from "./MachineLearningList";
import { CustomBackendForm } from "./Forms";
import { TestRequest } from "./TestRequest";
import { StartModelTraining } from "./StartModelTraining";
import "./MachineLearningSettings.scss";
import i18next from "i18next";

export const MachineLearningSettings = () => {
  const { t } = useTranslation();
  const api = useAPI();
  const { project, fetchProject } = useContext(ProjectContext);
  const [backends, setBackends] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loaded, setLoaded] = useState(false);

  useUpdatePageTitle(createTitleFromSegments([project?.title, t("ml_settings.page_title", "Model Settings")]));

  const fetchBackends = useCallback(async () => {
    if (!project?.id) {
      setLoading(false);
      return;
    }

    setLoading(true);
    const models = await api.callApi("mlBackends", {
      params: {
        project: project.id,
        include_static: true,
      },
    });

    if (models) setBackends(models);
    setLoading(false);
    setLoaded(true);
  }, [project, api]);

  const startTrainingModal = useCallback(
    (backend) => {
      const modalProps = {
        title: t("ml_settings.start_training_title", "Start Model Training"),
        style: { width: 760 },
        closeOnClickOutside: true,
        body: <StartModelTraining backend={backend} />,
      };
      modal(modalProps);
    },
    [project, t],
  );

  const showRequestModal = useCallback(
    (backend) => {
      const modalProps = {
        title: t("ml_settings.test_request_title", "Test Request"),
        style: { width: 760 },
        closeOnClickOutside: true,
        body: <TestRequest backend={backend} />,
      };
      modal(modalProps);
    },
    [project, t],
  );

  const showMLFormModal = useCallback(
    (backend) => {
      const action = backend ? "updateMLBackend" : "addMLBackend";
      const modalProps = {
        title: backend
          ? t("ml_settings.edit_model_title", "Edit Model")
          : t("ml_settings.connect_model_title", "Connect Model"),
        style: { width: 760 },
        closeOnClickOutside: false,
        body: (
          <CustomBackendForm
            action={action}
            backend={backend}
            project={project}
            onSubmit={() => {
              fetchBackends();
              modalRef.close();
            }}
          />
        ),
      };
      const modalRef = modal(modalProps);
    },
    [project, fetchBackends, t],
  );

  useEffect(() => {
    if (project?.id) {
      fetchBackends();
    }
  }, [project?.id, fetchBackends]);

  if (!project) {
    return <Spinner size={32} />;
  }

  return (
    <section>
      <div className="w-[42rem]">
        <Typography variant="headline" size="medium" className="mb-base">
          {t("ml_settings.section_title", "Model")}
        </Typography>

        {loading && <Spinner size={32} />}

        {loaded && backends.length === 0 && (
          <SimpleCard title="" className="bg-primary-background border-primary-border-subtler p-base">
            <EmptyState
              size="medium"
              variant="primary"
              icon={<IconModels />}
              title={t("ml_settings.empty_title", "Let's connect your first model")}
              description={t(
                "ml_settings.empty_desc",
                "Connect a machine learning model to generate live predictions for your project. Compare predictions, accelerate labeling with automatic prelabeling, and direct your team to the most impactful tasks through active learning.",
              )}
              actions={
                <Button
                  variant="primary"
                  look="filled"
                  onClick={() => showMLFormModal()}
                  aria-label={t("ml_settings.empty_add_aria", "Add machine learning model")}
                >
                  {t("ml_settings.connect_model_button", "Connect Model")}
                </Button>
              }
              footer={
                !window.APP_SETTINGS?.whitelabel_is_active && (
                  <Typography variant="label" size="small" className="text-primary-link">
                    <a
                      href="https://labelstud.io/guide/ml"
                      target="_blank"
                      rel="noopener noreferrer"
                      data-testid="ml-help-link"
                      aria-label={t("ml_settings.empty_learn_more_aria", "Learn more about machine learning models (opens in new window)")}
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

        <MachineLearningList
          onEdit={(backend) => showMLFormModal(backend)}
          onTestRequest={(backend) => showRequestModal(backend)}
          onStartTraining={(backend) => startTrainingModal(backend)}
          fetchBackends={fetchBackends}
          backends={backends}
        />

        {backends.length > 0 && (
          <div className="my-wide">
            <Typography size="small" className="text-neutral-content-subtler">
              {t(
                "ml_settings.instructions_intro",
                "A connected model has been detected! If you wish to fetch predictions from this model, please follow these steps:",
              )}
            </Typography>
            <Typography size="small" className="text-neutral-content-subtler mt-base">
              {t("ml_settings.instructions_step1", "1. Navigate to the Data Manager.")}
            </Typography>
            <Typography size="small" className="text-neutral-content-subtler mt-tighter">
              {t("ml_settings.instructions_step2", "2. Select the desired tasks.")}
            </Typography>
            <Typography size="small" className="text-neutral-content-subtler mt-tighter">
              {t("ml_settings.instructions_step3", "3. Click on Batch predictions from the Actions menu.")}
            </Typography>
            <Typography size="small" className="text-neutral-content-subtler mt-base">
              {t("ml_settings.instructions_prelabeling_part1", "If you want to use the model predictions for prelabeling, please configure this in the")}{" "}
              <NavLink to="annotation" className="hover:underline">
                {t("ml_settings.instructions_prelabeling_part2", "Annotation settings")}
              </NavLink>
              .
            </Typography>
          </div>
        )}

        <Form
          action="updateProject"
          formData={{ ...project }}
          params={{ pk: project.id }}
          onSubmit={() => fetchProject()}
        >
          {backends.length > 0 && (
            <div className="p-wide border border-neutral-border rounded-md">
              <Form.Row columnCount={1}>
                <Label text={t("ml_settings.config_label", "Configuration")} large />
                <div>
                  <Toggle
                    label={t("ml_settings.training_on_submit_label", "Start model training on annotation submission")}
                    description={t(
                      "ml_settings.training_on_submit_desc",
                      "This option will send a request to /train with information about annotations. You can use this to enable an Active Learning loop. You can also manually start training through model menu in its card.",
                    )}
                    name="start_training_on_annotation_update"
                  />
                </div>
              </Form.Row>
            </div>
          )}

          {backends.length > 0 && (
            <Form.Actions>
              <Form.Indicator>
                <span case="success">{t("common.saved", "Saved!")}</span>
              </Form.Indicator>
              <Button
                type="submit"
                look="primary"
                className="w-[120px]"
                aria-label={t("ml_settings.save_settings_aria", "Save machine learning settings")}
              >
                {t("save", "Save")}
              </Button>
            </Form.Actions>
          )}
        </Form>
      </div>
    </section>
  );
};

MachineLearningSettings.title = i18next.t("ml_settings.menu_title");
MachineLearningSettings.path = "/ml";
