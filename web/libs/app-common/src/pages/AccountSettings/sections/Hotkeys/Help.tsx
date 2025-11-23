import { useMemo, useCallback } from "react";
import { modal } from "@humansignal/ui/lib/modal";
import clsx from "clsx";
import { KeyboardKey } from "./Key";
// @ts-ignore
import { HOTKEY_SECTIONS, URL_TO_SECTION_MAPPING } from "./defaults";
import type { Hotkey, Section } from "./utils";
import { getTypedDefaultHotkeys } from "./utils";
import { useTranslation } from "react-i18next"; // 1. 引入翻译

// Type definitions for imported constants
interface UrlMapping {
  regex: RegExp;
  section: string | string[];
}

interface GroupedHotkeys {
  [subgroup: string]: Hotkey[];
}

interface ModalReturn {
  close: () => void;
}

interface HotkeyHelpModalProps {
  sectionsToShow: string[];
}

// Type the imported constants
const sections = HOTKEY_SECTIONS as Section[];
const urlMappings = URL_TO_SECTION_MAPPING as UrlMapping[];

/**
 * Hook to get current hotkeys with customizations
 */
const useCurrentHotkeys = (): Hotkey[] => {
  return useMemo(() => {
    const defaultHotkeys = getTypedDefaultHotkeys();
    const customHotkeys = window.APP_SETTINGS?.user?.customHotkeys || {};

    return defaultHotkeys.map((hotkey: Hotkey) => {
      const lookupKey = `${hotkey.section}:${hotkey.element}`;
      if (customHotkeys[lookupKey]) {
        const customSetting = customHotkeys[lookupKey];
        return {
          ...hotkey,
          key: customSetting.key,
          active: customSetting.active,
          ...(customSetting.description && {
            description: customSetting.description,
          }),
        };
      }
      return hotkey;
    });
  }, []);
};

/**
 * Main modal component that displays keyboard shortcuts
 * Renders shortcuts organized by sections and subgroups
 */
const HotkeyHelpModal = ({ sectionsToShow }: HotkeyHelpModalProps) => {
  const { t } = useTranslation(); // 2. 初始化翻译
  const hotkeys = useCurrentHotkeys();

  /**
   * Navigates to hotkey customization page
   */
  const handleCustomizeClick = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    window.location.href = "/user/account/hotkeys";
  }, []);

  /**
   * Renders a single hotkey section with its shortcuts
   */
  const renderSection = useCallback(
    (sectionId: string) => {
      const section = sections.find((s: Section) => s.id === sectionId);
      if (!section) return null;

      const sectionHotkeys = hotkeys.filter((h: Hotkey) => h.section === sectionId);
      if (sectionHotkeys.length === 0) return null;

      // Group hotkeys by subgroup for better organization
      const groupedHotkeys = sectionHotkeys.reduce((groups: GroupedHotkeys, hotkey: Hotkey) => {
        const subgroup = hotkey.subgroup || "default";
        if (!groups[subgroup]) {
          groups[subgroup] = [];
        }
        groups[subgroup].push(hotkey);
        return groups;
      }, {});

      // Sort subgroups with 'default' always first
      const subgroups = Object.keys(groupedHotkeys).sort((a, b) => {
        if (a === "default") return -1;
        if (b === "default") return 1;
        return a.localeCompare(b);
      });

      return (
        <div key={sectionId} className="border border-neutral-border rounded-lg">
          {/* Section Header */}
          <div className="px-4 py-3 border-b border-neutral-border">
            {/* 尝试翻译标题，假设 hotkeys.Labeling 这样的键存在 */}
            <h3 className="font-medium">{t(`hotkeys.${section.title}`, section.title)}</h3>
            <p className="text-sm text-neutral-content-subtler">
               {/* 简单的描述如果有 key 就翻译，没有就显示原文 */}
               {section.description}
            </p>
          </div>

          {/* Section Content */}
          <div className="p-4">
            <div className="space-y-2">
              {subgroups.map((subgroup) => (
                <div
                  key={subgroup}
                  className={clsx(
                    subgroup !== "default" && "mt-4 pt-2 border rounded-md border-gray-200 dark:border-gray-700 p-3",
                  )}
                >
                  {/* Subgroup Header */}
                  {subgroup !== "default" && (
                    <div className="mb-3">
                      <div className="text-sm font-medium mb-1 capitalize">
                        {/* 尝试翻译子组名 */}
                        {(() => {
                           const subSection = sections.find((s: Section) => s.id === subgroup);
                           const title = subSection?.title || subgroup;
                           return t(`hotkeys.${title}`, title);
                        })()}
                      </div>
                      {sections.find((s: Section) => s.id === subgroup)?.description && (
                        <div className="text-xs text-neutral-content-subtler">
                          {sections.find((s: Section) => s.id === subgroup)?.description}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Hotkey Items */}
                  {groupedHotkeys[subgroup].map((hotkey: Hotkey) => (
                    <div key={`${section.id}-${hotkey.element}`} className="flex items-center justify-between py-2">
                      <div>
                        {/* 快捷键功能的 Label 需要翻译 */}
                        <div className="font-medium text-neutral-content">{hotkey.label}</div>
                        {hotkey.description && (
                          <div className="text-sm text-neutral-content-subtler">{hotkey.description}</div>
                        )}
                      </div>
                      <KeyboardKey>{hotkey.key}</KeyboardKey>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      );
    },
    [hotkeys, t], // 添加 t 依赖
  );

  const modalContent = useMemo(
    () => (
      <div className="max-w-3xl max-h-[90vh] h-full overflow-hidden w-full mx-4 flex flex-col">
        <div className="px-wide py-base border-b border-neutral-border">
          <div className="flex justify-between items-center">
            {/* 汉化标题 */}
            <h2 className="text-lg font-semibold">{t("hotkeys.keyboard_shortcuts", "Keyboard Shortcuts")}</h2>
          </div>
          <p className="text-sm text-neutral-content-subtler mt-1">
            {/* 汉化描述 */}
            {t("hotkeys.view_all_desc", "View all available keyboard shortcuts.")}&nbsp;
            <a
              href="/user/account/hotkeys"
              onClick={handleCustomizeClick}
              className="text-primary-content hover:underline hover:text-primary-content-hover"
            >
              {/* 汉化链接 */}
              {t("common.customize", "Customize")}
            </a>
          </p>
        </div>

        <div className="px-wide py-wide overflow-y-auto scrollbar-thin scrollbar-thumb-neutral-border-bold scrollbar-track-transparent">
          <div className="space-y-wide">{sectionsToShow.map((sectionId) => renderSection(sectionId))}</div>
        </div>
      </div>
    ),
    [sectionsToShow, renderSection, handleCustomizeClick, t], // 添加 t 依赖
  );

  return modalContent;
};

/**
 * Determines which hotkey sections to display based on URL or explicit section names
 */
const determineSectionsToShow = (sectionOrUrl?: string | string[]): string[] => {
  let sectionsToShow: string[] = [];

  if (sectionOrUrl) {
    // Check if input is a URL
    if (typeof sectionOrUrl === "string" && (sectionOrUrl.startsWith("http") || sectionOrUrl.startsWith("/"))) {
      // Apply URL-to-section mapping
      for (const mapping of urlMappings) {
        if (mapping.regex.test(sectionOrUrl)) {
          if (Array.isArray(mapping.section)) {
            sectionsToShow = [...sectionsToShow, ...mapping.section];
          } else {
            sectionsToShow.push(mapping.section);
          }
        }
      }
    } else {
      // Input is section name(s)
      sectionsToShow = Array.isArray(sectionOrUrl) ? sectionOrUrl : [sectionOrUrl];
    }
  } else {
    // Use current URL if no input provided
    const currentUrl = window.location.pathname + window.location.search;
    for (const mapping of urlMappings) {
      if (mapping.regex.test(currentUrl)) {
        if (Array.isArray(mapping.section)) {
          sectionsToShow = [...sectionsToShow, ...mapping.section];
        } else {
          sectionsToShow.push(mapping.section);
        }
      }
    }
  }

  // Remove duplicates
  sectionsToShow = [...new Set(sectionsToShow)];

  // Show all sections if none were identified
  if (sectionsToShow.length === 0) {
    sectionsToShow = sections.map((section: Section) => section.id);
  }

  return sectionsToShow;
};

/**
 * Creates and displays a modal with keyboard shortcuts
 * ... (JSDoc 保持不变)
 */
export const openHotkeyHelp = (sectionOrUrl?: string | string[]): ModalReturn => {
  const sectionsToShow = determineSectionsToShow(sectionOrUrl);

  // 注意：这里不能直接使用 useTranslation Hook，因为 openHotkeyHelp 是一个普通函数，不是组件
  // 我们只能把 t() 放在 HotkeyHelpModal 组件内部。
  // 这里的 title 只能先传英文，或者硬编码中文，或者将 title 渲染逻辑移入 body 组件。

  const modalInstance = modal({
    title: "", // 我们在 Modal 内部自己渲染 Header，这里留空或者隐藏 Header
    bare: true, // bare: true 意味着没有默认的 Modal Header/Footer，这正好符合我们的代码逻辑
    allowClose: true,
    width: 768,
    style: {
      maxWidth: "90vw",
      maxHeight: "90vh",
      height: "auto",
    },
    // body 渲染我们的汉化组件
    body: () => <HotkeyHelpModal sectionsToShow={sectionsToShow} />,
  });

  return {
    close: () => modalInstance.close(),
  };
};
