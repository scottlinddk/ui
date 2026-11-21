import type { AnchorHTMLAttributes, HTMLAttributes, LiHTMLAttributes } from "react";
import { cn } from "../lib/cn.js";

export interface BreadcrumbProps extends HTMLAttributes<HTMLElement> {
  /** Accessible name of the landmark. */
  "aria-label"?: string;
}

export function Breadcrumb({
  "aria-label": label = "Breadcrumb",
  className,
  children,
  ...props
}: BreadcrumbProps) {
  return (
    <nav aria-label={label} className={cn("fds-breadcrumb", className)} {...props}>
      <ol className="fds-breadcrumb__list">{children}</ol>
    </nav>
  );
}

/** Separators are drawn by CSS between items; they are not in the accessibility tree. */
export function BreadcrumbItem({ className, ...props }: LiHTMLAttributes<HTMLLIElement>) {
  return <li className={cn("fds-breadcrumb__item", className)} {...props} />;
}

export function BreadcrumbLink({ className, ...props }: AnchorHTMLAttributes<HTMLAnchorElement>) {
  return <a className={cn("fds-breadcrumb__link", className)} {...props} />;
}

/** The current page: not a link, marked `aria-current="page"`. */
export function BreadcrumbPage({ className, ...props }: HTMLAttributes<HTMLSpanElement>) {
  return <span aria-current="page" className={cn("fds-breadcrumb__page", className)} {...props} />;
}
