import { cn } from "../../utils/bem";
import { Menu } from "../Menu/Menu";
import "./SidebarMenu.scss";

// 1. 在参数中接收 t
export const SidebarMenu = ({ children, menu, path, menuItems, t }) => {
  const rootClass = cn("sidebar-menu");

  return (
    <div className={rootClass}>
      {menuItems && menuItems.length > 1 ? (
        <div className={rootClass.elem("navigation")}>
          {/* 2. 将接收到的 t 传递给 Menu.Builder */}
          <Menu>{menuItems ? Menu.Builder(path, menuItems, t) : menu}</Menu>
        </div>
      ) : null}
      <div className={rootClass.elem("content")}>{children}</div>
    </div>
  );
};
