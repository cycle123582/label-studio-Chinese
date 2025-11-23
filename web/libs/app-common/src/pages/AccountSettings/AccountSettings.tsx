import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@humansignal/ui/lib/card-new/card";
import { useMemo, isValidElement } from "react";
import { Redirect, Route, Switch, useParams, useRouteMatch } from "react-router-dom";
import { useUpdatePageTitle, createTitleFromSegments } from "@humansignal/core";
import styles from "./AccountSettings.module.scss";
import { accountSettingsSections } from "./sections";
import { HotkeysHeaderButtons } from "./sections/Hotkeys";
import clsx from "clsx";
import { useAtomValue } from "jotai";
import { settingsAtom } from "./atoms";
import { useAuth } from "@humansignal/core/providers/AuthProvider";
// 1. 引入 i18n
import { useTranslation } from "react-i18next";

/**
 * FIXME: This is legacy imports. We're not supposed to use such statements
 * each one of these eventually has to be migrated to core/ui
 */
import { SidebarMenu } from "apps/labelstudio/src/components/SidebarMenu/SidebarMenu";

const AccountSettingsSection = () => {
  // 2. 初始化翻译
  const { t } = useTranslation();
  const { user, permissions } = useAuth();
  const { sectionId } = useParams<{ sectionId: string }>();
  const settings = useAtomValue(settingsAtom);
  const contentClassName = clsx(styles.accountSettings__content, {
    [styles.accountSettingsPadding]: window.APP_SETTINGS.billing !== undefined,
  });

  const resolvedSections = useMemo(() => {
    return settings.data && !("error" in settings.data) ? accountSettingsSections(settings.data, permissions) : [];
  }, [settings.data, user]);

  const currentSection = useMemo(
    () => resolvedSections.find((section) => section.id === sectionId),
    [resolvedSections, sectionId],
  );

  // Update page title to reflect the current section
  const pageTitleText = useMemo(() => {
    const myAccountText = t("user_account.my_account", "My Account"); // 翻译变量

    if (!currentSection) return myAccountText;

    // If title is a string, use it directly
    if (typeof currentSection.title === "string") {
      return createTitleFromSegments([currentSection.title, myAccountText]);
    }

    // For non-string titles (like JSX elements), derive from the section ID
    const titleFromId = currentSection.id
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");

    return createTitleFromSegments([titleFromId, myAccountText]);
  }, [currentSection, t]); // 添加 t 依赖

  useUpdatePageTitle(pageTitleText);

  if (!currentSection && resolvedSections.length > 0) {
    return <Redirect to={`${AccountSettingsPage.path}/${resolvedSections[0].id}`} />;
  }

  return currentSection ? (
    <div className={contentClassName}>
      <Card key={currentSection.id}>
        <CardHeader>
          <div className="flex flex-col gap-tight">
            <div className="flex justify-between items-center">
              {/* 这里的 title 来自 sections.ts，如果你改了 sections.ts，这里自然就是中文 */}
              <CardTitle>{currentSection.title}</CardTitle>
              {currentSection.id === "hotkeys" && (
                <div className="flex-shrink-0">
                  <HotkeysHeaderButtons />
                </div>
              )}
            </div>
            {currentSection.description && (
              <CardDescription>
                {isValidElement(currentSection.description) ? (
                  currentSection.description
                ) : (
                  <currentSection.description />
                )}
              </CardDescription>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <currentSection.component />
        </CardContent>
      </Card>
    </div>
  ) : null;
};

const AccountSettingsPage = () => {
  const settings = useAtomValue(settingsAtom);
  const match = useRouteMatch();
  const { sectionId } = useParams<{ sectionId: string }>();
  const { user, permissions } = useAuth();
  const resolvedSections = useMemo(() => {
    return settings.data && !("error" in settings.data) ? accountSettingsSections(settings.data, permissions) : [];
  }, [settings.data, user]);

  const menuItems = useMemo(
    () =>
      resolvedSections.map(({ title, id }) => ({
        title,
        path: `/${id}`,
        active: sectionId === id,
        exact: true,
      })),
    [resolvedSections, sectionId],
  );

  return (
    <div className={styles.accountSettings}>
      <SidebarMenu menuItems={menuItems} path={AccountSettingsPage.path}>
        <Switch>
          <Route path={`${match.path}/:sectionId`} component={AccountSettingsSection} />
          <Route exact path={match.path}>
            {resolvedSections.length > 0 && <Redirect to={`${match.path}/${resolvedSections[0].id}`} />}
          </Route>
        </Switch>
      </SidebarMenu>
    </div>
  );
};

// 3. 汉化静态属性 (这里不能用 hook，直接改为中文字符串)
AccountSettingsPage.title = "我的账户"; // 原文: My Account
AccountSettingsPage.path = "/user/account";
AccountSettingsPage.exact = false;
AccountSettingsPage.routes = () => [
  {
    title: () => "我的账户", // 原文: My Account
    path: "/account",
    component: () => <Redirect to={AccountSettingsPage.path} />,
  },
  {
    path: `${AccountSettingsPage.path}/:sectionId?`,
    component: AccountSettingsPage,
  },
];

export { AccountSettingsPage };
