import { useState, type HTMLAttributes } from "react";
import { cn } from "../lib/cn.js";

export interface AvatarProps extends HTMLAttributes<HTMLSpanElement> {
  src?: string;
  /** Alt text for the image. Empty string marks it decorative (name shown nearby). */
  alt?: string;
  /** Fallback text, typically initials. */
  fallback: string;
  size?: "sm" | "md" | "lg";
}

export function Avatar({ src, alt = "", fallback, size = "md", className, ...props }: AvatarProps) {
  const [failed, setFailed] = useState(false);
  const showImage = Boolean(src) && !failed;
  return (
    <span className={cn("fds-avatar", `fds-avatar--${size}`, className)} {...props}>
      {showImage ? (
        <img alt={alt} className="fds-avatar__image" onError={() => setFailed(true)} src={src} />
      ) : (
        <span aria-label={alt || undefined} aria-hidden={alt ? undefined : true}>
          {fallback}
        </span>
      )}
    </span>
  );
}

export function AvatarGroup({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div role="group" className={cn("fds-avatar-group", className)} {...props} />;
}
