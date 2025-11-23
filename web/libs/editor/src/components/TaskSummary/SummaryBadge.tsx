import type { PropsWithChildren } from "react";
import { cnm } from "@humansignal/ui";

export const SummaryBadge = ({ children }: PropsWithChildren) => {
  const className = cnm(
    "inline-flex items-center rounded-4 border px-tighter py-tightest",
    "text-xs font-semibold transition-colors",
    "bg-primary-background border-primary-emphasis text-accent-grape-dark",
  );
  return <div className={className}>{children}</div>;
};
