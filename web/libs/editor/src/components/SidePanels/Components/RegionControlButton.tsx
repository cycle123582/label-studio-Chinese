import { Button, type ButtonProps } from "@humansignal/ui";
import type { HotkeyList } from "libs/editor/src/core/Hotkey";
import { type FC, forwardRef } from "react";
import { WithHotkey } from "../../../common/Hotkey/WithHotkey";

export const RegionControlButton: FC<
  ButtonProps & {
    hotkey: HotkeyList;
  }
> = forwardRef(({ children, onClick, variant, look, tooltip, hotkey, ...props }, ref) => {
  return (
    <WithHotkey binging={hotkey}>
      <Button
        {...props}
        ref={ref}
        onClick={(e) => {
          e.stopPropagation();
          onClick?.(e);
        }}
        variant={variant}
        look={look}
        size="smaller"
        style={{ ...(props.style ?? {}) }}
        aria-label={typeof children === "string" ? children : "Region control"}
        tooltip={tooltip}
      >
        {children}
      </Button>
    </WithHotkey>
  );
});
