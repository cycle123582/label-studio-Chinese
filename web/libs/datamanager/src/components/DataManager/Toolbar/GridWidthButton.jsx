import { inject } from "mobx-react";
import { useCallback, useState } from "react";
import { Button, ButtonGroup } from "@humansignal/ui";
import { Dropdown } from "../../Common/Dropdown/DropdownComponent";
import { Toggle } from "../../Common/Form";
import { IconSettings, IconMinus, IconPlus } from "@humansignal/icons";
import debounce from "lodash/debounce";
// 1. 引入 i18next
import i18next from "i18next";

const injector = inject(({ store }) => {
  const view = store?.currentView;

  const cols = view.fieldsAsColumns ?? [];
  const hasImage = cols.some(({ type }) => type === "Image") ?? false;

  return {
    view,
    isGrid: view.type === "grid",
    gridWidth: view?.gridWidth,
    fitImagesToWidth: view?.gridFitImagesToWidth,
    hasImage,
  };
});

export const GridWidthButton = injector(({ view, isGrid, gridWidth, fitImagesToWidth, hasImage, size }) => {
  const [width, setWidth] = useState(gridWidth);

  const setGridWidthStore = debounce((value) => {
    view.setGridWidth(value);
  }, 200);

  const setGridWidth = useCallback(
    (width) => {
      const newWidth = Math.max(1, Math.min(width, 10));

      setWidth(newWidth);
      setGridWidthStore(newWidth);
    },
    [view],
  );

  const handleFitImagesToWidthToggle = useCallback(
    (e) => {
      view.setFitImagesToWidth(e.target.checked);
    },
    [view],
  );

  return isGrid ? (
    <Dropdown.Trigger
      content={
        <div className="p-tight min-w-wide space-y-base">
          <div className="grid grid-cols-[1fr_min-content] gap-base items-center">
            {/* 2. 翻译 "Columns: X" */}
            <span>
              {i18next.t("data_manager.grid_width.columns", { width, defaultValue: `Columns: ${width}` })}
            </span>
            <ButtonGroup collapsed={false}>
              <Button
                onClick={() => setGridWidth(width - 1)}
                disabled={width === 1}
                variant="neutral"
                look="outlined"
                leading={<IconMinus />}
                size="small"
                // 3. 翻译 Aria Label
                aria-label={i18next.t("data_manager.grid_width.decrease", "Decrease columns number")}
              />
              <Button
                onClick={() => setGridWidth(width + 1)}
                disabled={width === 10}
                variant="neutral"
                look="outlined"
                leading={<IconPlus />}
                size="small"
                // 4. 翻译 Aria Label
                aria-label={i18next.t("data_manager.grid_width.increase", "Increase columns number")}
              />
            </ButtonGroup>
          </div>
          {hasImage && (
            <div className="grid grid-cols-[1fr_min-content] gap-base items-center">
              {/* 5. 翻译 "Fit images to width" */}
              <span>{i18next.t("data_manager.grid_width.fit_images", "Fit images to width")}</span>
              <Toggle checked={fitImagesToWidth} onChange={handleFitImagesToWidthToggle} />
            </div>
          )}
        </div>
      }
    >
      {/* 6. 翻译 Settings 按钮的 Label */}
      <Button
        size={size}
        variant="neutral"
        look="outlined"
        aria-label={i18next.t("data_manager.grid_width.settings", "Grid settings")}
      >
        <IconSettings />
      </Button>
    </Dropdown.Trigger>
  ) : null;
});
