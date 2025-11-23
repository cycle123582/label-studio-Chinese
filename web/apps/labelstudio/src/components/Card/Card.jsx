import { cn } from "../../utils/bem";
import { Tooltip } from "@humansignal/ui";
import "./Card.scss";

export const Card = ({ header, extra, children, style }) => {
  const rootClass = cn("card");

  return (
    <div className={rootClass} style={style}>
      {(header || extra) && (
        <div className={rootClass.elem("header")}>
          <Tooltip title={header}>
            <div className="line-clamp-1">{header}</div>
          </Tooltip>

          {extra && <div className={rootClass.elem("header-extra")}>{extra}</div>}
        </div>
      )}
      <div className={rootClass.elem("content")}>{children}</div>
    </div>
  );
};
