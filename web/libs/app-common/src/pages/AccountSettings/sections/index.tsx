import { PersonalInfo } from "./PersonalInfo";
import { EmailPreferences } from "./EmailPreferences";
import { PersonalAccessToken, PersonalAccessTokenDescription } from "./PersonalAccessToken";
import { MembershipInfo } from "./MembershipInfo";
import { HotkeysManager } from "./Hotkeys";
import type React from "react";
import { PersonalJWTToken } from "./PersonalJWTToken";
import type { AuthTokenSettings } from "../types";
import { ABILITY, type AuthPermissions } from "@humansignal/core/providers/AuthProvider";
import { ff } from "@humansignal/core";
import { Badge } from "@humansignal/ui";

export type SectionType = {
  title: string | React.ReactNode;
  id: string;
  component: React.FC;
  description?: React.FC;
};

export const accountSettingsSections = (settings: AuthTokenSettings, permissions: AuthPermissions): SectionType[] => {
  const canCreateTokens = permissions.can(ABILITY.can_create_tokens);

  return [
    {
      title: "个人信息", // 原文: Personal Info
      id: "personal-info",
      component: PersonalInfo,
    },
    {
      title: (
        <div className="flex items-center gap-tight">
          <span>快捷键</span> {/* 原文: Hotkeys */}
          <Badge variant="beta">Beta</Badge>
        </div>
      ),
      id: "hotkeys",
      component: HotkeysManager,
      description: () =>
        "自定义键盘快捷键以加快您的工作流程。点击下方的任意快捷键，即可分配最适合您的新组合键。", // 原文: Customize your keyboard shortcuts...
    },
    {
      title: "邮件通知", // 原文: Email Preferences
      id: "email-preferences",
      component: EmailPreferences,
    },
    {
      title: "成员信息", // 原文: Membership Info
      id: "membership-info",
      component: MembershipInfo,
    },
    // 判断是否启用新版 Token
    settings.api_tokens_enabled &&
      canCreateTokens &&
      ff.isActive(ff.FF_AUTH_TOKENS) && {
        title: "个人访问令牌", // 原文: Personal Access Token
        id: "personal-access-token",
        component: PersonalJWTToken,
        description: PersonalAccessTokenDescription, // 这个组件我们在之前已经汉化过了
      },
    // 判断是否启用旧版 Token
    settings.legacy_api_tokens_enabled &&
      canCreateTokens && {
        title: ff.isActive(ff.FF_AUTH_TOKENS) ? "旧版令牌" : "访问令牌", // 原文: Legacy Token / Access Token
        id: "legacy-token",
        component: PersonalAccessToken,
        description: PersonalAccessTokenDescription,
      },
  ].filter(Boolean) as SectionType[];
};
