import type { Meta, StoryObj } from "@storybook/react";
import { EmptyState } from "./empty-state";
import { Button } from "../button/button";
import {
  IconUpload,
  IconSearch,
  IconInbox,
  IconLsLabeling,
  IconLsReview,
  IconCheck,
  IconCloudProviderS3,
  IconCloudProviderGCS,
  IconCloudProviderAzure,
  IconCloudProviderRedis,
  IconExternal,
  IconRelationLink,
} from "@humansignal/icons";
import { Typography } from "../typography/typography";
import { Tooltip } from "../Tooltip/Tooltip";

const meta: Meta<typeof EmptyState> = {
  component: EmptyState,
  title: "UI/Empty State (空状态)",
  parameters: {
    docs: {
      description: {
        component:
          "一个可复用的空状态组件，用于在应用程序中显示各种空状态，支持不同尺寸和自定义内容。",
      },
    },
  },
  argTypes: {
    size: {
      control: "select",
      options: ["large", "medium", "small"],
      description: "空状态组件的尺寸",
    },
    variant: {
      control: "select",
      options: ["primary", "neutral", "negative", "positive", "warning", "gradient"],
      description: "空状态的颜色变体",
    },
    icon: {
      control: false,
      description: "显示的图标元素",
    },

    title: {
      control: "text",
      description: "主标题文本",
    },
    description: {
      control: "text",
      description: "标题下方的描述文本",
    },
    actions: {
      control: false,
      description: "操作按钮或其他交互元素",
    },
    additionalContent: {
      control: false,
      description: "显示在描述和操作按钮之间的附加内容",
    },
    footer: {
      control: false,
      description: "显示在底部的页脚内容",
    },
  },
};

export default meta;
type Story = StoryObj<typeof EmptyState>;

// Basic Stories
export const Default: Story = {
  args: {
    size: "medium",
    variant: "primary",
    icon: <IconInbox />,
    title: "添加您的首个条目",
    description: "添加新条目以开始构建您的集合",
    footer: (
      <Typography variant="label" size="small" className="text-primary-link">
        <a href="/docs/labeling-interface" className="inline-flex items-center gap-1 hover:underline">
          了解更多
          <IconExternal width={16} height={16} />
        </a>
      </Typography>
    ),
  },
};

export const WithSingleAction: Story = {
  args: {
    size: "medium",
    variant: "primary",
    icon: <IconUpload />,
    title: "上传您的数据",
    description: "从您的电脑中选择一个文件以开始",
    actions: (
      <Button variant="primary" look="filled">
        上传文件
      </Button>
    ),
  },
};

export const WithMultipleActions: Story = {
  args: {
    size: "medium",
    variant: "primary",
    icon: <IconUpload />,
    title: "导入数据以开始",
    description: "连接您的云存储或从电脑上传文件",
    actions: (
      <>
        <Button variant="primary" look="filled" className="flex-1">
          连接云存储
        </Button>
        <Button variant="primary" look="outlined" className="flex-1">
          上传文件
        </Button>
      </>
    ),
  },
};

// Size Comparison Stories
export const SizeComparison: Story = {
  render: () => (
    <div className="space-y-12">
      <div>
        <h3 className="text-lg font-semibold mb-4">大尺寸 (数据管理页风格)</h3>
        <div className="border border-neutral-border rounded-lg p-4 h-96">
          <EmptyState
            size="large"
            variant="primary"
            icon={<IconUpload />}
            title="导入数据以启动您的项目"
            description="连接您的云存储或从电脑上传文件"
            actions={
              <>
                <Button variant="primary" look="filled" className="flex-1">
                  连接云存储
                </Button>
                <Button variant="primary" look="outlined" className="flex-1">
                  导入
                </Button>
              </>
            }
          />
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-4">中尺寸 (主页风格)</h3>
        <div className="border border-neutral-border rounded-lg p-4 h-64">
          <EmptyState
            size="medium"
            variant="primary"
            icon={<IconUpload />}
            title="创建您的第一个项目"
            description="导入数据并设置标注界面以开始标注"
            actions={
              <Button variant="primary" look="filled">
                创建项目
              </Button>
            }
          />
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-4">小尺寸 (侧边栏风格)</h3>
        <div className="border border-neutral-border rounded-lg p-4 h-48">
          <EmptyState
            size="small"
            variant="primary"
            icon={<IconLsLabeling />}
            title="已标注的区域将显示在此处"
            description="开始标注并使用此面板跟踪您的结果"
            footer={
              <Typography variant="label" size="small" className="text-primary-link">
                <a href="/docs/labeling-interface" className="inline-flex items-center gap-1 hover:underline">
                  了解更多
                  <IconExternal width={16} height={16} />
                </a>
              </Typography>
            }
          />
        </div>
      </div>
    </div>
  ),
};

// Color Variant Stories
export const ColorVariants: Story = {
  render: () => (
    <div className="grid grid-cols-3 gap-8">
      <div className="border border-neutral-border rounded-lg p-4 h-64">
        <EmptyState
          size="medium"
          variant="primary"
          icon={<IconUpload />}
          title="主要变体 (Primary)"
          description="标准空状态的默认蓝色主题"
        />
      </div>

      <div className="border border-neutral-border rounded-lg p-4 h-64">
        <EmptyState
          size="medium"
          variant="neutral"
          icon={<IconInbox />}
          title="中性变体 (Neutral)"
          description="用于中性状态的灰色主题"
        />
      </div>

      <div className="border border-neutral-border rounded-lg p-4 h-64">
        <EmptyState
          size="medium"
          variant="negative"
          icon={<IconSearch />}
          title="消极变体 (Negative)"
          description="用于错误状态和失败的红色主题"
        />
      </div>

      <div className="border border-neutral-border rounded-lg p-4 h-64">
        <EmptyState
          size="medium"
          variant="positive"
          icon={<IconCheck />}
          title="积极变体 (Positive)"
          description="用于成功状态的绿色主题"
        />
      </div>

      <div className="border border-neutral-border rounded-lg p-4 h-64">
        <EmptyState
          size="medium"
          variant="warning"
          icon={<IconSearch />}
          title="警告变体 (Warning)"
          description="用于警告状态的橙色/黄色主题"
        />
      </div>

      <div className="border border-neutral-border rounded-lg p-4 h-64">
        <EmptyState
          size="medium"
          variant="gradient"
          icon={<IconLsLabeling />}
          title="渐变变体 (Gradient)"
          description="具有特殊效果和脉动动画的 AI 渐变主题"
        />
      </div>
    </div>
  ),
};

// Data Manager Inspired Stories
export const DataManagerImport: Story = {
  args: {
    size: "large",
    variant: "primary",
    icon: <IconUpload />,
    title: "导入数据以启动您的项目",
    description: "连接您的云存储或从电脑上传文件",
    additionalContent: (
      <div className="flex items-center justify-center gap-base">
        <Tooltip title="Amazon S3">
          <div className="flex items-center justify-center p-2">
            <IconCloudProviderS3 width={32} height={32} className="text-neutral-content-subtler" />
          </div>
        </Tooltip>
        <Tooltip title="Google Cloud Storage">
          <div className="flex items-center justify-center p-2">
            <IconCloudProviderGCS width={32} height={32} className="text-neutral-content-subtler" />
          </div>
        </Tooltip>
        <Tooltip title="Azure Blob Storage">
          <div className="flex items-center justify-center p-2">
            <IconCloudProviderAzure width={32} height={32} className="text-neutral-content-subtler" />
          </div>
        </Tooltip>
        <Tooltip title="Redis Storage">
          <div className="flex items-center justify-center p-2">
            <IconCloudProviderRedis width={32} height={32} className="text-neutral-content-subtler" />
          </div>
        </Tooltip>
      </div>
    ),
    actions: (
      <>
        <Button variant="primary" look="filled" className="flex-1">
          连接云存储
        </Button>
        <Button variant="primary" look="outlined" className="flex-1">
          导入
        </Button>
      </>
    ),
    footer: (
      <Typography variant="label" size="small" className="text-primary-link hover:underline">
        <a href="/docs/import-data" className="inline-flex items-center gap-1">
          查看关于导入数据的文档
          <IconExternal width={20} height={20} />
        </a>
      </Typography>
    ),
  },
};

export const AnnotatorLabelingState: Story = {
  args: {
    size: "medium",
    variant: "primary",
    icon: <IconLsLabeling />,
    title: "开始标注任务",
    description: "开始标注并在此处跟踪您的进度",
    actions: (
      <Button variant="primary" look="filled">
        标注所有任务
      </Button>
    ),
  },
};

export const ReviewerEmptyState: Story = {
  args: {
    size: "medium",
    variant: "primary",
    icon: <IconLsReview />,
    title: "开始审核任务",
    description: "将任务导入此项目以开始审核",
  },
};

export const NoResultsFound: Story = {
  args: {
    size: "medium",
    variant: "warning",
    icon: <IconSearch />,
    title: "优化您的搜索",
    description: "调整或清除过滤器以查看更多结果",
    actions: (
      <Button variant="primary" look="outlined">
        清除过滤器
      </Button>
    ),
  },
};

export const AssignedTasksEmpty: Story = {
  args: {
    size: "medium",
    variant: "neutral",
    icon: <IconInbox />,
    title: "等待任务分配",
    description: "当有任务分配给您时，请回到这里查看",
  },
};

export const LabelingQueueComplete: Story = {
  args: {
    size: "medium",
    variant: "positive",
    icon: <IconCheck />,
    title: "您已完成所有工作！",
    description: "队列中的所有任务均已完成",
    actions: (
      <Button variant="primary" look="outlined">
        转到上一个任务
      </Button>
    ),
  },
};

// Complex Content Example
export const ComplexContent: Story = {
  args: {
    size: "large",
    variant: "primary",
    icon: <IconUpload />,
    title: "上传您的文件",
    description: "选择多种上传选项和格式以开始",
    additionalContent: (
      <div className="text-center">
        <Typography variant="label" size="small" className="text-neutral-content-subtler mb-2">
          支持的格式：CSV, JSON, TSV, TXT
        </Typography>
        <div className="flex justify-center items-center gap-2 text-neutral-content-subtler">
          <div className="w-2 h-2 bg-positive-icon rounded-full" />
          <Typography variant="label" size="smallest">
            支持拖放
          </Typography>
        </div>
      </div>
    ),
    actions: (
      <>
        <Button variant="primary" look="filled" className="flex-1">
          浏览文件
        </Button>
        <Button variant="primary" look="outlined" className="flex-1">
          连接存储
        </Button>
        <Button variant="neutral" look="outlined">
          从 URL 导入
        </Button>
      </>
    ),
    footer: (
      <div className="text-center space-y-1">
        <Typography variant="label" size="small" className="text-primary-link">
          <a href="/docs/import-guide" className="hover:underline">
            需要帮助？查看我们的导入指南
          </a>
        </Typography>
        <Typography variant="label" size="smallest" className="text-neutral-content-subtler">
          最大文件大小：每个文件 100MB
        </Typography>
      </div>
    ),
  },
};

// Accessibility Example
export const WithAccessibility: Story = {
  args: {
    size: "medium",
    variant: "primary",
    icon: <IconInbox />,
    title: "建立您的集合",
    description: "开始添加条目以创建您的第一个集合",
    titleId: "accessible-empty-title",
    descriptionId: "accessible-empty-desc",
    "aria-label": "添加条目以建立您的集合",
    "data-testid": "accessible-empty-state",
    actions: (
      <Button variant="primary" look="filled">
        添加首个条目
      </Button>
    ),
  },
};

// Relations Panel Example
export const RelationsPanel: Story = {
  args: {
    size: "small",
    variant: "primary",
    icon: <IconRelationLink />,
    title: "创建标签之间的关系",
    description: "添加关系以建立已标注区域之间的连接",
    actions: (
      <Button variant="primary" look="outlined" size="small">
        添加关系
      </Button>
    ),
  },
};
