import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@humansignal/shad/components/ui/card";
import { cn } from "@humansignal/shad/utils";
import type { HtmlHTMLAttributes, PropsWithChildren, ReactNode } from "react";

export function SimpleCard({
  children,
  title,
  description,
  flushContent = false,
  flushHeader = false,
  headerClassName,
  contentClassName,
  className: cls,
  ...rest
}: PropsWithChildren<
  {
    title: ReactNode;
    description?: ReactNode;
    flushContent?: boolean;
    flushHeader?: boolean;
    headerClassName?: string;
    contentClassName?: string;
  } & Omit<HtmlHTMLAttributes<HTMLDivElement>, "title">
>) {
  const className = cn("bg-transparent", cls);
  const hasHeaderContent = Boolean(title || description);
  const headerClass = cn(flushHeader ? "p-0" : "p-4 pb-2", headerClassName);
  const contentClass = cn(
    flushContent ? "p-0" : "p-4",
    { "pt-0": hasHeaderContent && !flushContent },
    contentClassName,
  );
  return (
    <Card className={className} {...rest}>
      {hasHeaderContent && (
        <CardHeader className={headerClass}>
          {title && <CardTitle className="flex justify-between font-medium">{title}</CardTitle>}
          {description && <CardDescription>{description}</CardDescription>}
        </CardHeader>
      )}
      <CardContent className={contentClass}>{children}</CardContent>
    </Card>
  );
}
