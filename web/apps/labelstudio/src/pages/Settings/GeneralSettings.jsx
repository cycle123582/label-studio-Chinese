import { EnterpriseBadge, Select, Typography } from "@humansignal/ui";
import { useCallback, useContext } from "react";
import { useTranslation } from "react-i18next"; // 导入 i18n hook
import { Button } from "@humansignal/ui";
import { Form, Input, TextArea } from "../../components/Form";
import { RadioGroup } from "../../components/Form/Elements/RadioGroup/RadioGroup";
import { ProjectContext } from "../../providers/ProjectProvider";
import { cn } from "../../utils/bem";
import { HeidiTips } from "../../components/HeidiTips/HeidiTips";
import { FF_LSDV_E_297, isFF } from "../../utils/feature-flags";
import { createURL } from "../../components/HeidiTips/utils";

export const GeneralSettings = () => {
  const { t } = useTranslation(); // 初始化 t 函数
  const { project, fetchProject } = useContext(ProjectContext);

  const updateProject = useCallback(() => {
    if (project.id) fetchProject(project.id, true);
  }, [project, fetchProject]);

  const colors = ["#FDFDFC", "#FF4C25", "#FF750F", "#ECB800", "#9AC422", "#34988D", "#617ADA", "#CC6FBE"];

  // 将采样选项移到组件内部以便翻译
  const samplings = [
    {
      value: "Sequential",
      label: t("general_settings.sampling_sequential_label", "Sequential"),
      description: t("general_settings.sampling_sequential_desc", "Tasks are ordered by Task ID"),
    },
    {
      value: "Uniform",
      label: t("general_settings.sampling_random_label", "Random"),
      description: t("general_settings.sampling_random_desc", "Tasks are chosen with uniform random"),
    },
  ];

  return (
    <div className={cn("general-settings").toClassName()}>
      <div className={cn("general-settings").elem("wrapper").toClassName()}>
        <h1>{t("general_settings.section_title", "General Settings")}</h1>
        <div className={cn("settings-wrapper").toClassName()}>
          <Form action="updateProject" formData={{ ...project }} params={{ pk: project.id }} onSubmit={updateProject}>
            <Form.Row columnCount={1} rowGap="16px">
              <Input name="title" label={t("general_settings.project_name_label", "Project Name")} />
              <TextArea
                name="description"
                label={t("general_settings.description_label", "Description")}
                style={{ minHeight: 128 }}
              />
              {isFF(FF_LSDV_E_297) && (
                <div className={cn("workspace-placeholder").toClassName()}>
                  <div className={cn("workspace-placeholder").elem("badge-wrapper").toClassName()}>
                    <div className={cn("workspace-placeholder").elem("title").toClassName()}>
                      {t("common.workspace", "Workspace")}
                    </div>
                    <EnterpriseBadge className="ml-2" />
                  </div>
                  <Select placeholder={t("common.select_option", "Select an option")} disabled options={[]} />
                  <Typography size="small" className="my-tight">
                    {t("common.workspace_description", "Simplify project management by organizing projects into workspaces.")}{" "}
                    <a
                      target="_blank"
                      href={createURL(
                        "https://docs.humansignal.com/guide/manage_projects#Create-workspaces-to-organize-projects",
                        {
                          experiment: "project_settings_tip",
                          treatment: "simplify_project_management",
                        },
                      )}
                      rel="noreferrer"
                      className="underline hover:no-underline"
                    >
                      {t("common.learn_more", "Learn more")}
                    </a>
                  </Typography>
                </div>
              )}
              <RadioGroup
                name="color"
                label={t("general_settings.color_label", "Color")}
                size="large"
                labelProps={{ size: "large" }}
              >
                {colors.map((color) => (
                  <RadioGroup.Button key={color} value={color}>
                    <div className={cn("color").toClassName()} style={{ "--background": color }} />
                  </RadioGroup.Button>
                ))}
              </RadioGroup>

              <RadioGroup
                label={t("general_settings.sampling_title", "Task Sampling")}
                labelProps={{ size: "large" }}
                name="sampling"
                simple
              >
                {samplings.map(({ value, label, description }) => (
                  <RadioGroup.Button
                    key={value}
                    value={`${value} sampling`}
                    label={`${label} ${t("general_settings.sampling_suffix", "sampling")}`}
                    description={description}
                  />
                ))}
                {isFF(FF_LSDV_E_297) && (
                  <RadioGroup.Button
                    key="uncertainty-sampling"
                    value=""
                    label={
                      <>
                        {t("general_settings.sampling_uncertainty_label", "Uncertainty sampling")}{" "}
                        <EnterpriseBadge className="ml-2" />
                      </>
                    }
                    disabled
                    description={
                      <>
                        {t("general_settings.sampling_uncertainty_desc", "Tasks are chosen according to model uncertainty score (active learning mode).")}{" "}
                        <a
                          target="_blank"
                          href={createURL("https://docs.humansignal.com/guide/active_learning", {
                            experiment: "project_settings_workspace",
                            treatment: "workspaces",
                          })}
                          rel="noreferrer"
                        >
                          {t("common.learn_more", "Learn more")}
                        </a>
                      </>
                    }
                  />
                )}
              </RadioGroup>
            </Form.Row>

            <Form.Actions>
              <Form.Indicator>
                <span case="success">{t("common.saved", "Saved!")}</span>
              </Form.Indicator>
              <Button
                type="submit"
                className="w-[150px]"
                aria-label={t("general_settings.save_aria", "Save general settings")}
              >
                {t("save", "Save")}
              </Button>
            </Form.Actions>
          </Form>
        </div>
      </div>
      {isFF(FF_LSDV_E_297) && <HeidiTips collection="projectSettings" />}
    </div>
  );
};

GeneralSettings.menuItem = "general_settings.menu_title";
GeneralSettings.path = "/";
GeneralSettings.exact = true;
