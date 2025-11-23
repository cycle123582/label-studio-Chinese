import { forwardRef, useCallback, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { cn } from "../../utils/bem";
import { useDropdown } from "../Dropdown/Dropdown";
import "./Menu.scss";
import { Block, Elem, MenuContext } from "./MenuContext";
import { MenuItem } from "./MenuItem";

export const Menu = forwardRef(
  ({ children, className, style, size, selectedKeys, closeDropdownOnItemClick, contextual }, ref) => {
    const dropdown = useDropdown();
    const selected = useMemo(() => new Set(selectedKeys ?? []), [selectedKeys]);
    const clickHandler = useCallback(
      (e) => {
        const elem = cn("main-menu").elem("item").closest(e.target);
        if (dropdown && elem && closeDropdownOnItemClick !== false) dropdown.close();
      },
      [dropdown],
    );
    const collapsed = useMemo(() => !!dropdown, [dropdown]);
    return (
      <MenuContext.Provider value={{ selected }}>
        <Block
          ref={ref}
          tag="ul"
          name="main-menu"
          mod={{ size, collapsed, contextual }}
          mix={className}
          style={style}
          onClick={clickHandler}
        >
          {children}
        </Block>
      </MenuContext.Provider>
    );
  },
);

Menu.Item = MenuItem;
Menu.Spacer = () => <Elem block="main-menu" tag="li" name="spacer" />;
Menu.Divider = () => <Elem block="main-menu" tag="li" name="divider" />;

Menu.Builder = (url, menuItems, t) => {
  const translate = t || ((key) => key);
  return (menuItems ?? []).map((item, index) => {
    if (item === "SPACER") return <Menu.Spacer key={index} />;
    if (item === "DIVIDER") return <Menu.Divider key={index} />;
    let pageLabel, pagePath;
    if (Array.isArray(item)) {
      [pagePath, pageLabel] = item;
    } else {
      const { menuItem, title, path } = item;
      pageLabel = title ?? menuItem;
      pagePath = path;
    }
    if (typeof pagePath === "function") {
      return (
        <Menu.Item key={index} onClick={pagePath}>
          {translate(pageLabel)}
        </Menu.Item>
      );
    }
    const location = `${url}${pagePath}`.replace(/([/]+)/g, "/");
    return (
      <Menu.Item key={index} to={location} exact>
        {translate(pageLabel)}
      </Menu.Item>
    );
  });
};

Menu.Group = ({ children, title, className, style }) => {
  const { t } = useTranslation();
  return (
    <Block name="menu-group" mix={className} style={style}>
      <Elem name="title">{t(title, title)}</Elem>
      <Elem tag="ul" name="list">
        {children}
      </Elem>
    </Block>
  );
};
