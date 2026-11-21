import { createContext, useContext, useId, type HTMLAttributes } from "react";
import { cn } from "../lib/cn.js";
import { Collapsible, type CollapsibleProps } from "./Collapsible.js";

const Context = createContext<string | undefined>(undefined);

export interface AccordionProps extends HTMLAttributes<HTMLDivElement> {
  /** `single` keeps one item open (native exclusive `<details name>`). */
  type?: "single" | "multiple";
}

/** Group of `<details>` items; keeps working without JavaScript. */
export function Accordion({ type = "multiple", className, ...props }: AccordionProps) {
  const name = useId();
  return (
    <Context.Provider value={type === "single" ? name : undefined}>
      <div className={cn("fds-accordion", className)} {...props} />
    </Context.Provider>
  );
}

export function AccordionItem(props: CollapsibleProps) {
  const name = useContext(Context);
  return <Collapsible name={name} {...props} />;
}
