import { useCallback, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useAPI } from "../../providers/ApiProvider";
import { useHistory } from "react-router";
import { useProject } from "../../providers/ProjectProvider";
import WebhookDetail from "./WebhookDetail";
import WebhookList from "./WebhookList";
import { createTitleFromSegments, useUpdatePageTitle } from "@humansignal/core";

const Webhook = () => {
  const { t } = useTranslation();
  const [activeWebhook, setActiveWebhook] = useState(null);
  const [webhooks, setWebhooks] = useState(null);
  const [webhooksInfo, setWebhooksInfo] = useState(null);

  // 新增：加载状态，默认为 true
  const [loading, setLoading] = useState(true);

  const history = useHistory();
  const api = useAPI();
  const { project } = useProject();

  // 动态更新页面标题 (浏览器标签页标题)
  useUpdatePageTitle(createTitleFromSegments([project?.title, t("webhook_page.page_title", "Webhooks Settings")]));

  const projectId = useMemo(() => {
    return project?.id;
  }, [project]);

  const fetchWebhooks = useCallback(async () => {
    if (!projectId) return;
    try {
      const response = await api.callApi('webhooks', {
        params: {
          project: projectId,
        },
      });
      // 确保结果是数组，防止为 null 报错
      setWebhooks(response.results ?? []);
    } catch (err) {
      console.error("Failed to fetch webhooks", err);
      setWebhooks([]);
    }
  }, [projectId, api]);

  const fetchWebhooksInfo = useCallback(async () => {
    if (!projectId) return;
    try {
      const response = await api.callApi('webhooksInfo', {
        params: {
          project: projectId,
        },
      });
      setWebhooksInfo(response);
    } catch (err) {
      console.error("Failed to fetch webhooks info", err);
    }
  }, [projectId, api]);

  // 统一的数据加载 Effect
  useEffect(() => {
    if (projectId) {
      setLoading(true);
      Promise.all([fetchWebhooks(), fetchWebhooksInfo()])
        .finally(() => {
          setLoading(false); // 数据加载完成后（无论成功失败），取消 Loading 状态
        });
    }
  }, [projectId, fetchWebhooks, fetchWebhooksInfo]);

  // === 修复点 1: 解决界面空白问题 ===
  // 当正在加载，或者项目ID尚未准备好时，显示加载文字，而不是 return null
  if (loading || projectId === null) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: '40px', color: '#888' }}>
        {/* 这里可以换成你项目中的 <Block> 或 <Spin> 组件 */}
        Loading Webhooks...
      </div>
    );
  }

  // 确保 webhooks 不为 null (容错)
  const safeWebhooks = webhooks || [];
  let content = null;

  if (activeWebhook === "new") {
    content = (
      <WebhookDetail
        onSelectActive={setActiveWebhook}
        onBack={() => setActiveWebhook(null)}
        webhook={null}
        fetchWebhooks={fetchWebhooks}
        webhooksInfo={webhooksInfo}
      />
    );
  } else if (activeWebhook === null) {
    content = (
      <WebhookList
        onSelectActive={setActiveWebhook}
        onAddWebhook={() => {
          setActiveWebhook("new");
        }}
        fetchWebhooks={fetchWebhooks}
        webhooks={safeWebhooks}
      />
    );
  } else {
    const webhook = safeWebhooks.find((x) => x.id === activeWebhook);
    if (webhook) {
      content = (
        <WebhookDetail
          onSelectActive={setActiveWebhook}
          onBack={() => setActiveWebhook(null)}
          webhook={webhook}
          fetchWebhooks={fetchWebhooks}
          webhooksInfo={webhooksInfo}
        />
      );
    } else {
       // 如果找不到选中的 webhook（比如被删除了），重置状态
       setActiveWebhook(null);
    }
  }

  return <section className="w-[42rem]">{content}</section>;
};

export const WebhookPage = {
  // === 修复点 2: 解决标题显示 webhook_page.menu_title 的问题 ===
  // 由于这是静态对象，不支持 t()。
  // 建议直接写死英文 "Webhooks" 或者中文 "Webhooks"，
  // 除非你的 Sidebar 组件内部有逻辑去自动翻译这个 title 字段。
  title: "Webhooks",

  path: "/webhooks",
  component: Webhook,
};
