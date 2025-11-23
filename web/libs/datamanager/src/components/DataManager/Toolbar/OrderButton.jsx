import { IconSortDown, IconSortUp } from "@humansignal/icons";
import { Button, ButtonGroup } from "@humansignal/ui";
import { inject } from "mobx-react";
import { FieldsButton } from "../../Common/FieldsButton";
import { Space } from "../../Common/Space/Space";
// 1. 引入 i18next
import i18next from "i18next";

const injector = inject(({ store }) => {
  const view = store?.currentView;

  return {
    view,
    ordering: view?.currentOrder,
  };
});

export const OrderButton = injector(({ size, ordering, view, ...rest }) => {
  return (
    <Space style={{ fontSize: 12 }}>
      <ButtonGroup collapsed {...rest}>
        <FieldsButton
          size={size}
          style={{ minWidth: 67, textAlign: "left", marginRight: -1 }}
          // 2. 汉化 "Order by" 按钮标题
          title={ordering ? ordering.column?.title : i18next.t("data_manager.order_by", "Order by")}
          onClick={(col) => view.setOrdering(col.id)}
          onReset={() => view.setOrdering(null)}
          // 3. 汉化 "Default" (重置选项)
          resetTitle={i18next.t("data_manager.sort.default", "Default")}
          selected={ordering?.field}
          filter={(col) => {
            return col.orderable ?? col.original?.orderable;
          }}
          wrapper={({ column, children }) => (
            <Space style={{ width: "100%", justifyContent: "space-between" }}>
              {children}

              <div
                style={{
                  width: 24,
                  height: 24,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {column?.icon}
              </div>
            </Space>
          )}
          openUpwardForShortViewport={false}
        />

        <Button
          size={size}
          look="outlined"
          variant="neutral"
          disabled={!!ordering === false}
          onClick={() => view.setOrdering(ordering?.field)}
          // 4. 汉化 Aria Label (升序/降序)
          aria-label={
            ordering?.desc
              ? i18next.t("data_manager.sort.ascending", "Sort ascending")
              : i18next.t("data_manager.sort.descending", "Sort descending")
          }
        >
          {ordering?.desc ? <IconSortUp /> : <IconSortDown />}
        </Button>
      </ButtonGroup>
    </Space>
  );
});
