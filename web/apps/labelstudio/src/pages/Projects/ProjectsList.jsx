import chr from "chroma-js";
import { format } from "date-fns";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { NavLink } from "react-router-dom";
import { IconCheck, IconEllipsis, IconMinus, IconSparks } from "@humansignal/icons";
// 修正：将 "@humansignalsa/ui" 改回 "@humansignal/ui"
import { Userpic, Button } from "@humansignal/ui";
import { Dropdown, Menu, Pagination } from "../../components";
import { cn } from "../../utils/bem";
import { absoluteURL } from "../../utils/helpers";

const DEFAULT_CARD_COLORS = ["#FFFFFF", "#FDFDFC"];

export const ProjectsList = ({ projects, currentPage, totalItems, loadNextPage, pageSize }) => {
  const { t } = useTranslation();

  return (
    <>
      <div className={cn("projects-page").elem("list").toClassName()}>
        {projects.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>
      <div className={cn("projects-page").elem("pages").toClassName()}>
        <Pagination
          name="projects-list"
          label={t("pages.projects_page.pagination_label", "Projects")}
          page={currentPage}
          totalItems={totalItems}
          urlParamName="page"
          pageSize={pageSize}
          pageSizeOptions={[10, 30, 50, 100]}
          onPageLoad={(page, pageSize) => loadNextPage(page, pageSize)}
        />
      </div>
    </>
  );
};

export const EmptyProjectsList = ({ openModal }) => {
  const { t } = useTranslation();

  return (
    <div className={cn("empty-projects-page").toClassName()}>
      <img
        alt={t("pages.projects_page.empty.alt_text", "Heidi looking for projects")}
        className={cn("empty-projects-page").elem("heidi").toClassName()}
        src={absoluteURL("/static/images/opossum_looking.png")}
      />
      <h1 className={cn("empty-projects-page").elem("header").toClassName()}>
        {t("pages.projects_page.empty.title", "Heidi doesn't see any projects here!")}
      </h1>
      <p>{t("pages.projects_page.empty.subtitle", "Create one and start labeling your data.")}</p>
      <Button
        onClick={openModal}
        className="my-8"
        aria-label={t("pages.projects_page.create_new_project", "Create new project")}
      >
        {t("home_page.actions.create_project", "Create Project")}
      </Button>
    </div>
  );
};

const ProjectCard = ({ project }) => {
  const { t } = useTranslation();

  const color = useMemo(() => {
    return DEFAULT_CARD_COLORS.includes(project.color) ? null : project.color;
  }, [project]);

  const projectColors = useMemo(() => {
    const textColor =
      color && chr(color).luminance() > 0.3
        ? "var(--color-neutral-inverted-content)"
        : "var(--color-neutral-inverted-content)";
    return color
      ? {
          "--header-color": color,
          "--background-color": chr(color).alpha(0.2).css(),
          "--text-color": textColor,
          "--border-color": chr(color).alpha(0.5).css(),
        }
      : {};
  }, [color]);

  return (
    <NavLink
      className={cn("projects-page").elem("link").toClassName()}
      to={`/projects/${project.id}/data`}
      data-external
    >
      <div className={cn("project-card").mod({ colored: !!color }).toClassName()} style={projectColors}>
        <div className={cn("project-card").elem("header").toClassName()}>
          <div className={cn("project-card").elem("title").toClassName()}>
            <div className={cn("project-card").elem("title-text").toClassName()}>
              {project.title ?? t("pages.projects_page.card.new_project_title", "New project")}
            </div>

            <div
              className={cn("project-card").elem("menu").toClassName()}
              onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
              }}
            >
              <Dropdown.Trigger
                content={
                  <Menu contextual>
                    <Menu.Item href={`/projects/${project.id}/settings`}>{t("Settings", "Settings")}</Menu.Item>
                    <Menu.Item href={`/projects/${project.id}/data?labeling=1`}>{t("Labeling", "Label")}</Menu.Item>
                  </Menu>
                }
              >
                <Button
                  size="smaller"
                  look="string"
                  aria-label={t("pages.projects_page.card.options_aria_label", "Project options")}
                >
                  <IconEllipsis />
                </Button>
              </Dropdown.Trigger>
            </div>
          </div>
          <div className={cn("project-card").elem("summary").toClassName()}>
            <div className={cn("project-card").elem("annotation").toClassName()}>
              <div className={cn("project-card").elem("total").toClassName()}>
                {t("home_page.task_progress", "{{finished}} / {{total}} tasks ({{percentage}}%)", {
                  finished: project.finished_task_number,
                  total: project.task_number,
                  percentage: project.task_number > 0 ? Math.round((project.finished_task_number / project.task_number) * 100) : 0,
                })}
              </div>
              <div className={cn("project-card").elem("detail").toClassName()}>
                <div className={cn("project-card").elem("detail-item").mod({ type: "completed" }).toClassName()}>
                  <IconCheck className={cn("project-card").elem("icon").toClassName()} />
                  {project.total_annotations_number}
                </div>
                <div className={cn("project-card").elem("detail-item").mod({ type: "rejected" }).toClassName()}>
                  <IconMinus className={cn("project-card").elem("icon").toClassName()} />
                  {project.skipped_annotations_number}
                </div>
                <div className={cn("project-card").elem("detail-item").mod({ type: "predictions" }).toClassName()}>
                  <IconSparks className={cn("project-card").elem("icon").toClassName()} />
                  {project.total_predictions_number}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className={cn("project-card").elem("description").toClassName()}>{project.description}</div>
        <div className={cn("project-card").elem("info").toClassName()}>
          <div className={cn("project-card").elem("created-date").toClassName()}>
            {format(new Date(project.created_at), "dd MMM 'yy, HH:mm")}
          </div>
          <div className={cn("project-card").elem("created-by").toClassName()}>
            <Userpic src="#" user={project.created_by} showUsernameTooltip />
          </div>
        </div>
      </div>
    </NavLink>
  );
};
