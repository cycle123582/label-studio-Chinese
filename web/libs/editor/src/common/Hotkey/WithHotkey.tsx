import { Children, cloneElement, forwardRef, type ReactElement } from "react";
import { Hotkey } from "../../core/Hotkey";
import type { ButtonProps } from "@humansignal/ui";
import type Keymaster from "keymaster";
import { useHotkey } from "../../hooks/useHotkey";
import { isDefined } from "../../utils/utilities";

type HotkeyProps = {
  binging?: keyof typeof Hotkey.keymap;
  hotkeyScope?: string;
  displayedHotkey?: keyof typeof Hotkey.keymap;
  children: ReactElement<ButtonProps>;
};
export const WithHotkey = forwardRef<HTMLElement, HotkeyProps>(
  ({ children, binging: hotkey, hotkeyScope, displayedHotkey }: HotkeyProps, ref) => {
    Children.only(children);

    const { onClick, tooltip } = children.props;
    const clone = cloneElement(children, { ref, tooltip: undefined });

    useHotkey(hotkey, onClick as unknown as Keymaster.KeyHandler, hotkeyScope);

    if (
      (hotkey && isDefined(Hotkey.keymap[hotkey])) ||
      (displayedHotkey && isDefined(Hotkey.keymap[displayedHotkey]))
    ) {
      return (
        <Hotkey.Tooltip name={hotkey || displayedHotkey} title={tooltip}>
          {clone}
        </Hotkey.Tooltip>
      );
    }

    return clone;
  },
);
