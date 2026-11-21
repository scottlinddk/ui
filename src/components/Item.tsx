import type { HTMLAttributes } from "react";
import { cn } from "../lib/cn.js";

export function ItemGroup({ className, ...props }: HTMLAttributes<HTMLUListElement>) {
  return <ul className={cn("fds-item-group", className)} {...props} />;
}

export interface ItemProps extends HTMLAttributes<HTMLLIElement> {
  variant?: "default" | "outline";
}

/** List row: media, content (title/description) and actions. Render inside `ItemGroup`. */
export function Item({ variant = "default", className, ...props }: ItemProps) {
  return <li className={cn("fds-item", `fds-item--${variant}`, className)} {...props} />;
}

export function ItemMedia({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("fds-item__media", className)} {...props} />;
}

export function ItemContent({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("fds-item__content", className)} {...props} />;
}

export function ItemTitle({ className, ...props }: HTMLAttributes<HTMLParagraphElement>) {
  return <p className={cn("fds-item__title", className)} {...props} />;
}

export function ItemDescription({ className, ...props }: HTMLAttributes<HTMLParagraphElement>) {
  return <p className={cn("fds-item__description", className)} {...props} />;
}

export function ItemActions({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("fds-item__actions", className)} {...props} />;
}
