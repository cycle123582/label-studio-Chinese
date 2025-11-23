import { useCallback, useContext, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next"; // 导入 i18n hook
import { Button } from "@humansignal/ui";
import { useUpdatePageTitle, createTitleFromSegments } from "@humansignal/core";
import { Form, TextArea, Toggle } from "../../components/Form";
import { MenubarContext } from "../../components/Menubar/Menubar";
import { cn } from "../../utils/bem";
import i18next from "i18next";

import { ModelVersionSelector } from "./AnnotationSettings/ModelVersionSelector";
import { ProjectContext } from "../../providers/ProjectProvider";
import { Divider } from "../../components/Divider/Divider";

export const AnnotationSettings = () => {
  const { t } = useTranslation(); // 初始化 t 函数
  const { project, fetchProject } = useContext(ProjectContext);
  const pageContext = useContext(MenubarContext);
  const formRef = useRef();
  const [collab, setCollab] = useState(null);

  useUpdatePageTitle(createTitleFromSegments([project?.title, t("annotation_settings.page_title", "Annotation Settings")]));

  useEffect(() => {
    pageContext.setProps({ formRef });
  }, [formRef, pageContext]);

  const updateProject = useCallback(() => {
    fetchProject(project.id, true);
  }, [project, fetchProject]);

  return (
    <div className={cn("annotation-settings").toClassName()}>
      <div className={cn("annotation-settings").elem("wrapper").toClassName()}>
        <h1>{t("annotation_settings.section_title", "Annotation Settings")}</h1>
        <div className={cn("settings-wrapper").toClassName()}>
          <Form
            ref={formRef}
            action="updateProject"
            formData={{ ...project }}
            params={{ pk: project.id }}
            onSubmit={updateProject}
          >
            <Form.Row columnCount={1}>
              <div className={cn("settings-wrapper").elem("header").toClassName()}>
                {t("annotation_settings.instructions_title", "Labeling Instructions")}
              </div>
              <div className="settings-description">
                <p style={{ marginBottom: "0" }}>
                  {t("annotation_settings.instructions_desc1", "Write instructions to help users complete labeling tasks.")}
                </p>
                <p style={{ marginTop: "8px" }}>
                  {t(
                    "annotation_settings.instructions_desc2",
                    "The instruction field supports HTML markup and it allows use of images, iframes (pdf).",
                  )}
                </p>
              </div>
              <div>
                <Toggle
                  label={t("annotation_settings.show_before_labeling", "Show before labeling")}
                  name="show_instruction"
                />
              </div>
              <TextArea name="expert_instruction" style={{ minHeight: 128, maxWidth: "520px" }} />
            </Form.Row>

            <Divider height={32} />

            <Form.Row columnCount={1}>
              <br />
              <div className={cn("settings-wrapper").elem("header").toClassName()}>
                {t("annotation_settings.prelabeling_title", "Prelabeling")}
              </div>
              <div>
                <Toggle
                  label={t("annotation_settings.use_predictions", "Use predictions to prelabel tasks")}
                  description={
                    <span>
                      {t(
                        "annotation_settings.use_predictions_desc",
                        "Enable and select which set of predictions to use for prelabeling.",
                      )}
                    </span>
                  }
                  name="show_collab_predictions"
                  onChange={(e) => {
                    setCollab(e.target.checked);
                  }}
                />
              </div>

              {(collab !== null ? collab : project.show_collab_predictions) && <ModelVersionSelector />}
            </Form.Row>

            <Form.Actions>
              <Form.Indicator>
                <span case="success">{t("common.saved", "Saved!")}</span>
              </Form.Indicator>
              <Button
                type="submit"
                look="primary"
                className="w-[150px]"
                aria-label={t("annotation_settings.save_aria", "Save annotation settings")}
              >
                {t("save", "Save")}
              </Button>
            </Form.Actions>
          </Form>
        </div>
      </div>
    </div>
  );
};

// 将静态 title 改为一个翻译键
AnnotationSettings.title = i18next.t("annotation_settings.menu_title");
AnnotationSettings.path = "/annotation";
