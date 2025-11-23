import type { ReactNode } from "react";
import { useTranslation } from "react-i18next"; // 1. 引入翻译 Hook
import styles from "./Key.module.scss";

// Type definitions
interface KeyboardKeyProps {
  children: ReactNode;
}

// Individual key styling component
const IndividualKey = ({ children }: { children: ReactNode }) => {
  return <kbd className={styles.individualKey}>{children}</kbd>;
};

/**
 * KeyboardKey component for displaying keyboard shortcuts as individual styled keys
 * Splits compound shortcuts (like "Ctrl+A") into separate visual key components
 */
export const KeyboardKey = ({ children }: KeyboardKeyProps) => {
  const { t } = useTranslation(); // 2. 初始化翻译

  // Convert children to string for parsing
  const keyString = String(children);

  // Split the key combination by common separators
  const keys = keyString
    .split(/[\+\s]+/) // Split by + or spaces
    .filter((key) => key.trim().length > 0) // Remove empty strings
    .map((key) => {
      const trimmed = key.trim();

      // 3. 处理按键显示的逻辑
      // 如果是单个字母 (a, b, s)，直接转大写
      if (trimmed.length === 1) {
        return trimmed.toUpperCase();
      }

      // 如果是功能键 (ctrl, shift, space)，尝试去翻译文件查找 "key_names.ctrl"
      // 如果找不到翻译，默认将首字母大写 (ctrl -> Ctrl)
      return t(`key_names.${trimmed.toLowerCase()}`, trimmed.charAt(0).toUpperCase() + trimmed.slice(1));
    });

  // Render all keys consistently
  return (
    <div className={styles.keyGroup}>
      {keys.map((key, index) => (
        <IndividualKey key={index}>{key}</IndividualKey>
      ))}
    </div>
  );
};
