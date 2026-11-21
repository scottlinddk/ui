import type { DetailsHTMLAttributes, ReactNode } from "react";
import { cn } from "../lib/cn.js";

export interface CollapsibleProps extends Omit<DetailsHTMLAttributes<HTMLDetailsElement>, "title"> {
  title: ReactNode;
}

/** Native `<details>`: works without JavaScript and is server-compatible. */
export function Collapsible({ title, className, children, ...props }: CollapsibleProps) {
  return (
    <details className={cn("fds-collapsible", className)} {...props}>
      <summary className="fds-collapsible__summary">{title}</summary>
      <div className="fds-collapsible__content">{children}</div>
    </details>
  );
}
