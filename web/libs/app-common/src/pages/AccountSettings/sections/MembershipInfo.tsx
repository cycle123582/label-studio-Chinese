import { format } from "date-fns";
import styles from "./MembershipInfo.module.scss";
import { useQuery } from "@tanstack/react-query";
import { getApiInstance } from "@humansignal/core";
import { useMemo } from "react";
import type { WrappedResponse } from "@humansignal/core/lib/api-proxy/types";
import { useAuth } from "@humansignal/core/providers/AuthProvider";
import { useTranslation } from "react-i18next"; // 1. 引入翻译 Hook

// 2. 修改日期格式为 ISO 标准或中文习惯 (yyyy-MM-dd HH:mm)
function formatDate(date?: string) {
  return format(new Date(date ?? ""), "yyyy-MM-dd HH:mm");
}

export const MembershipInfo = () => {
  const { t } = useTranslation(); // 3. 初始化翻译
  const { user } = useAuth();

  const dateJoined = useMemo(() => {
    if (!user?.date_joined) return null;
    return formatDate(user?.date_joined);
  }, [user?.date_joined]);

  const membership = useQuery({
    queryKey: [user?.active_organization, user?.id, "user-membership"],
    async queryFn() {
      if (!user) return {};
      const api = getApiInstance();
      const response = (await api.invoke("userMemberships", {
        pk: user.active_organization,
        userPk: user.id,
      })) as WrappedResponse<{
        user: number;
        organization: number;
        contributed_projects_count: number;
        annotations_count: number;
        created_at: string;
        role: string;
      }>;

      const annotationCount = response?.annotations_count;
      const contributions = response?.contributed_projects_count;

      // 4. 修改默认值为翻译键
      let role = "roles.owner";

      // 5. 将 API 返回的角色代码映射为翻译键
      switch (response.role) {
        case "OW":
          role = "roles.owner";
          break;
        case "DI":
          role = "roles.deactivated";
          break;
        case "AD":
          role = "roles.administrator";
          break;
        case "MA":
          role = "roles.manager";
          break;
        case "AN":
          role = "roles.annotator";
          break;
        case "RE":
          role = "roles.reviewer";
          break;
        case "NO":
          role = "roles.pending";
          break;
        default:
          role = "roles.owner"; // Fallback
      }

      return {
        annotationCount,
        contributions,
        role,
      };
    },
  });

  const organization = useQuery({
    queryKey: ["organization", user?.active_organization],
    async queryFn() {
      if (!user) return null;
      if (!window?.APP_SETTINGS?.billing) return null;
      const api = getApiInstance();
      const organization = (await api.invoke("organization", {
        pk: user.active_organization,
      })) as WrappedResponse<{
        id: number;
        external_id: string;
        title: string;
        token: string;
        default_role: string;
        created_at: string;
      }>;

      if (!organization.$meta.ok) {
        return null;
      }

      return {
        ...organization,
        createdAt: formatDate(organization.created_at),
      } as const;
    },
  });

  return (
    <div className={styles.membershipInfo} id="membership-info">
      {/* User ID */}
      <div className="flex gap-2 w-full justify-between">
        <div>{t("membership.user_id", "User ID")}</div>
        <div>{user?.id}</div>
      </div>

      {/* Registration date */}
      <div className="flex gap-2 w-full justify-between">
        <div>{t("membership.registration_date", "Registration date")}</div>
        <div>{dateJoined}</div>
      </div>

      {/* Annotations Submitted */}
      <div className="flex gap-2 w-full justify-between">
        <div>{t("membership.annotations_submitted", "Annotations Submitted")}</div>
        <div>{membership.data?.annotationCount}</div>
      </div>

      {/* Projects contributed to */}
      <div className="flex gap-2 w-full justify-between">
        <div>{t("membership.projects_contributed", "Projects contributed to")}</div>
        <div>{membership.data?.contributions}</div>
      </div>

      <div className={styles.divider} />

      {/* Organization */}
      {user?.active_organization_meta && (
        <div className="flex gap-2 w-full justify-between">
          <div>{t("membership.organization", "Organization")}</div>
          <div>{user.active_organization_meta.title}</div>
        </div>
      )}

      {/* My role - 这里使用了 t() 来翻译上面 queryFn 返回的键 */}
      {membership.data?.role && (
        <div className="flex gap-2 w-full justify-between">
          <div>{t("membership.my_role", "My role")}</div>
          <div>{t(membership.data.role)}</div>
        </div>
      )}

      {/* Organization ID */}
      <div className="flex gap-2 w-full justify-between">
        <div>{t("membership.organization_id", "Organization ID")}</div>
        <div>{user?.active_organization}</div>
      </div>

      {/* Owner */}
      {user?.active_organization_meta && (
        <div className="flex gap-2 w-full justify-between">
          <div>{t("membership.owner", "Owner")}</div>
          <div>{user.active_organization_meta.email}</div>
        </div>
      )}

      {/* Created */}
      {organization.data?.createdAt && (
        <div className="flex gap-2 w-full justify-between">
          <div>{t("membership.created_at", "Created")}</div>
          <div>{organization.data?.createdAt}</div>
        </div>
      )}
    </div>
  );
};
