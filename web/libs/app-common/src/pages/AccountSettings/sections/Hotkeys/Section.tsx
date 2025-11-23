import clsx from "clsx";
import { useTranslation } from "react-i18next"; // 1. 引入翻译 Hook
import { Button } from "@humansignal/ui";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@humansignal/shad/components/ui/card";
import { HotkeyItem } from "./Item";

// Type definitions
interface Hotkey {
  id: string;
  section: string;
  element: string;
  label: string;
  key: string;
  mac?: string;
  active: boolean;
  subgroup?: string;
  description?: string;
}

interface Section {
  id: string;
  title: string;
  description?: string;
}

interface GroupedHotkeys {
  [subgroup: string]: Hotkey[];
}

interface HotkeySectionProps {
  section: Section;
  hotkeys: Hotkey[];
  editingHotkeyId: string | null;
  onEditHotkey: (id: string) => void;
  onSaveHotkey: (id: string, newKey: string) => void;
  onCancelEdit: () => void;
  onSaveSection: (sectionId: string) => void;
  onToggleHotkey: (id: string) => void;
  hasChanges: boolean;
}

/**
 * HotkeySection Component
 */
export const HotkeySection = ({
  section,
  hotkeys,
  editingHotkeyId,
  onEditHotkey,
  onSaveHotkey,
  onCancelEdit,
  onSaveSection,
  onToggleHotkey,
  hasChanges,
}: HotkeySectionProps) => {
  const { t } = useTranslation(); // 2. 初始化翻译

  /**
   * Groups hotkeys by their subgroup property
   */
  const groupedHotkeys: GroupedHotkeys = hotkeys.reduce((groups: GroupedHotkeys, hotkey: Hotkey) => {
    const subgroup = hotkey.subgroup || "default";
    if (!groups[subgroup]) {
      groups[subgroup] = [];
    }
    groups[subgroup].push(hotkey);
    return groups;
  }, {});

  /**
   * Gets sorted subgroup names with 'default' always appearing first
   */
  const subgroups: string[] = Object.keys(groupedHotkeys).sort((a: string, b: string) => {
    if (a === "default") return -1;
    if (b === "default") return 1;
    return a.localeCompare(b);
  });

  /**
   * Handles the save section button click
   */
  const handleSaveSection = (): void => {
    onSaveSection(section.id);
  };

  return (
    <Card className="mb-6">
      <CardHeader className="pb-2">
        {/* 3. 尝试翻译 section 的标题和描述 */}
        <CardTitle>{t(section.title, section.title)}</CardTitle>
        <CardDescription>
          {section.description ? t(section.description, section.description) : ""}
        </CardDescription>
      </CardHeader>

      <CardContent>
        <div>
          {subgroups.map((subgroup: string) => (
            <div
              key={subgroup}
              className={clsx(subgroup !== "default" && "mt-4 pt-2 border rounded-md border-border p-3")}
            >
              {groupedHotkeys[subgroup].map((hotkey: Hotkey) => (
                <HotkeyItem
                  key={hotkey.id}
                  hotkey={hotkey}
                  onEdit={onEditHotkey}
                  onToggle={onToggleHotkey}
                  isEditing={editingHotkeyId === hotkey.id}
                  onSave={onSaveHotkey}
                  onCancel={onCancelEdit}
                />
              ))}
            </div>
          ))}

          {hotkeys.length === 0 && (
            <div className="py-8 text-center text-muted-foreground italic">
              {/* 4. 汉化空状态提示 */}
              {t("hotkeys.no_hotkeys_in_section", "No hotkeys in this section")}
            </div>
          )}
        </div>
      </CardContent>

      <CardFooter className="flex justify-end">
        <Button variant="primary" onClick={handleSaveSection} disabled={!hasChanges}>
          {/* 5. 汉化保存按钮 */}
          {t("common.save", "Save")}
        </Button>
      </CardFooter>
    </Card>
  );
};
