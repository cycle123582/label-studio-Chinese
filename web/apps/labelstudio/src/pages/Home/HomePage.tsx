import { IconExternal, IconFolderAdd, IconHumanSignal, IconUserAdd, IconFolderOpen } from "@humansignal/icons";
import { Button, SimpleCard, Spinner, Typography } from "@humansignal/ui";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Link } from "react-router-dom";
import { useUpdatePageTitle } from "@humansignal/core";
import { HeidiTips } from "../../components/HeidiTips/HeidiTips";
import { useAPI } from "../../providers/ApiProvider";
import { CreateProject } from "../CreateProject/CreateProject";
import { InviteLink } from "../Organization/PeoplePage/InviteLink";
import type { Page } from "../types/Page";
import { useTranslation, TFunction } from "react-i18next";

const PROJECTS_TO_SHOW = 10;

interface ProjectSimpleCardProps {
  project: APIProject;
  t: TFunction;
}

export const HomePage: Page = () => {
  const { t } = useTranslation();
  const api = useAPI();
  const [creationDialogOpen, setCreationDialogOpen] = useState(false);
  const [invitationOpen, setInvitationOpen] = useState(false);

  useUpdatePageTitle(t("home_page.title", "Home"));

  const { data, isFetching, isSuccess, isError } = useQuery({
    queryKey: ["projects", { page_size: 10 }],
    async queryFn() {
      return api.callApi<{ results: APIProject[]; count: number }>("projects", {
        params: { page_size: PROJECTS_TO_SHOW },
      });
    },
  });

  const resources = [
    {
      title: t("home_page.resources.documentation", "Documentation"),
      url: "https://labelstud.io/guide/",
    },
    {
      title: t("home_page.resources.api_documentation", "API Documentation"),
      url: "https://api.labelstud.io/api-reference/introduction/getting-started",
    },
    {
      title: t("home_page.resources.release_notes", "Release Notes"),
      url: "https://labelstud.io/learn/categories/release-notes/",
    },
    {
      title: t("home_page.resources.ls_blog", "LabelStud.io Blog"),
      url: "https://labelstud.io/blog/",
    },
    {
      title: t("home_page.resources.slack_community", "Slack Community"),
      url: "https://slack.labelstud.io",
    },
  ];

  const actions = [
    {
      title: t("home_page.actions.create_project", "Create Project"),
      icon: IconFolderAdd,
      type: "createProject",
    },
    {
      title: t("home_page.actions.invite_members", "Invite Members"),
      icon: IconUserAdd,
      type: "inviteMembers",
    },
  ] as const;

  type Action = (typeof actions)[number]["type"];

  const handleActions = (action: Action) => {
    return () => {
      switch (action) {
        case "createProject":
          setCreationDialogOpen(true);
          break;
        case "inviteMembers":
          setInvitationOpen(true);
          break;
      }
    };
  };

  return (
    <main className="p-6">
      <div className="grid grid-cols-[minmax(0,1fr)_450px] gap-6">
        <section className="flex flex-col gap-6">
          <div className="flex flex-col gap-1">
            <Typography variant="headline" size="small">
              {t("home_page.welcome", "Welcome 👋")}
            </Typography>
            <Typography size="small" className="text-neutral-content-subtler">
              {t("home_page.get_started_subtext", "Let's get you started.")}
            </Typography>
          </div>
          <div className="flex justify-start gap-4">
            {actions.map((action) => {
              return (
                <Button
                  key={action.title}
                  look="outlined"
                  align="center"
                  className="flex-grow-0 text-16/24 gap-2 text-primary-content text-left min-w-[250px] [&_svg]:w-6 [&_svg]:h-6 pl-2"
                  onClick={handleActions(action.type)}
                  leading={<action.icon />}
                >
                  {action.title}
                </Button>
              );
            })}
          </div>

          <SimpleCard
            title={
              data && data?.count > 0 ? (
                <>
                  {t("home_page.recent_projects", "Recent Projects")}{" "}
                  <a href="/projects" className="text-lg font-normal hover:underline">
                    {t("home_page.view_all", "View All")}
                  </a>
                </>
              ) : null
            }
          >
            {isFetching ? (
              <div className="h-64 flex justify-center items-center">
                <Spinner />
              </div>
            ) : isError ? (
              <div className="h-64 flex justify-center items-center">{t("home_page.cant_load_projects", "Can't load projects")}</div>
            ) : isSuccess && data && data.results.length === 0 ? (
              <div className="flex flex-col justify-center items-center border border-primary-border-subtle bg-primary-emphasis-subtle rounded-lg h-64">
                <div
                  className={
                    "rounded-full w-12 h-12 flex justify-center items-center bg-accent-grape-subtle text-primary-icon"
                  }
                >
                  <IconFolderOpen />
                </div>
                <Typography variant="headline" size="small">
                  {t("home_page.create_first_project_title", "Create your first project")}
                </Typography>
                <Typography size="small" className="text-neutral-content-subtler">
                  {t(
                    "home_page.create_first_project_subtitle",
                    "Import your data and set up the labeling interface to start annotating",
                  )}
                </Typography>
                <Button
                  className="mt-4"
                  onClick={() => setCreationDialogOpen(true)}
                  aria-label={t("home_page.create_new_project_aria", "Create new project")}
                >
                  {t("home_page.actions.create_project", "Create Project")}
                </Button>
              </div>
            ) : isSuccess && data && data.results.length > 0 ? (
              <div className="flex flex-col gap-1">
                {data.results.map((project) => {
                  return <ProjectSimpleCard key={project.id} project={project} t={t} />;
                })}
              </div>
            ) : null}
          </SimpleCard>
        </section>
        <section className="flex flex-col gap-6">
          <HeidiTips collection="projectSettings" />
          <SimpleCard
            title={t("home_page.resources.title", "Resources")}
            description={t("home_page.resources.description", "Learn, explore and get help")}
            data-testid="resources-card"
          >
            <ul>
              {resources.map((link) => {
                return (
                  <li key={link.title}>
                    <a
                      href={link.url}
                      className="py-2 px-1 flex justify-between items-center text-neutral-content"
                      target="_blank"
                      rel="noreferrer"
                    >
                      {link.title}
                      <IconExternal className="text-primary-icon" />
                    </a>
                  </li>
                );
              })}
            </ul>
          </SimpleCard>
          <div className="flex gap-2 items-center">
            <IconHumanSignal />
            <span className="text-neutral-content-subtle">
              {t("home_page.ls_version", "Label Studio Version: Community")}
            </span>
          </div>
        </section>
      </div>
      {creationDialogOpen && <CreateProject onClose={() => setCreationDialogOpen(false)} />}
      <InviteLink opened={invitationOpen} onClosed={() => setInvitationOpen(false)} />
    </main>
  );
};

HomePage.title = "Home";
HomePage.path = "/";
HomePage.exact = true;

function ProjectSimpleCard({ project, t }: ProjectSimpleCardProps) {
  const finished = project.finished_task_number ?? 0;
  const total = project.task_number ?? 0;
  const progress = total > 0 ? (finished / total) * 100 : 0;
  const white = "#FFFFFF";
  const color = project.color && project.color !== white ? project.color : "#E1DED5";
  const percentage = Math.round(progress);

  return (
    <Link
      to={`/projects/${project.id}`}
      className="block even:bg-neutral-surface rounded-sm overflow-hidden"
      data-external
    >
      <div
        className="grid grid-cols-[minmax(0,1fr)_150px] p-2 py-3 items-center border-l-[3px]"
        style={{ borderLeftColor: color }}
      >
        <div className="flex flex-col gap-1">
          <span className="text-neutral-content">{project.title}</span>
          <div className="text-neutral-content-subtler text-sm">
            {t("home_page.task_progress", "{{finished}} of {{total}} Tasks ({{percentage}}%)", {
              finished,
              total,
              percentage,
            })}
          </div>
        </div>
        <div className="bg-neutral-surface rounded-full overflow-hidden w-full h-2 shadow-neutral-border-subtle shadow-border-1">
          <div className="bg-positive-surface-hover h-full" style={{ maxWidth: `${progress}%` }} />
        </div>
      </div>
    </Link>
  );
}
