import type { AnchorHTMLAttributes, HTMLAttributes, LiHTMLAttributes, ReactNode } from "react";
import { cn } from "../lib/cn.js";

/** Presentational: page state and URLs stay in the app. */
export function Pagination({
  "aria-label": label = "Pagination",
  className,
  ...props
}: HTMLAttributes<HTMLElement>) {
  return <nav aria-label={label} className={cn("fds-pagination", className)} {...props} />;
}

export function PaginationContent({ className, ...props }: HTMLAttributes<HTMLUListElement>) {
  return <ul className={cn("fds-pagination__list", className)} {...props} />;
}

export function PaginationItem(props: LiHTMLAttributes<HTMLLIElement>) {
  return <li {...props} />;
}

export interface PaginationLinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  active?: boolean;
}

export function PaginationLink({ active, className, ...props }: PaginationLinkProps) {
  return (
    <a
      aria-current={active ? "page" : undefined}
      className={cn("fds-pagination__link", className)}
      {...props}
    />
  );
}

export interface PaginationStepProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  children?: ReactNode;
}

export function PaginationPrevious({ children = "Previous", ...props }: PaginationStepProps) {
  return (
    <PaginationLink rel="prev" {...props}>
      {children}
    </PaginationLink>
  );
}

export function PaginationNext({ children = "Next", ...props }: PaginationStepProps) {
  return (
    <PaginationLink rel="next" {...props}>
      {children}
    </PaginationLink>
  );
}

export function PaginationEllipsis({ className, ...props }: HTMLAttributes<HTMLSpanElement>) {
  return (
    <span className={cn("fds-pagination__ellipsis", className)} {...props}>
      <span aria-hidden="true">…</span>
      <span className="fds-visually-hidden">More pages</span>
    </span>
  );
}
