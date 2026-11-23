import { useEffect, useRef, useState, type ReactNode } from "react";
import { Accordion, AccordionItem, Badge, Button } from "../src/index.js";
import { benefits, faq, installCommand, riskReversal, steps, tagline } from "./landing-data.js";

const reducedMotion = () =>
  typeof matchMedia !== "undefined" && matchMedia("(prefers-reduced-motion: reduce)").matches;

/** Rises and fades in once when it enters the viewport. Content stays visible without JavaScript. */
export function Reveal({
  as: Tag = "div",
  className = "",
  children,
  ...rest
}: {
  as?: "div" | "section";
  className?: string;
  children: ReactNode;
  id?: string;
  "aria-labelledby"?: string;
}) {
  const ref = useRef<HTMLElement>(null);
  const [state, setState] = useState<"idle" | "armed" | "shown">("idle");
  useEffect(() => {
    const node = ref.current;
    if (!node || reducedMotion() || typeof IntersectionObserver === "undefined") return;
    if (node.getBoundingClientRect().top < innerHeight) return; // already in view, no motion
    setState("armed");
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;
        setState("shown");
        observer.disconnect();
      },
      { rootMargin: "0px 0px -10% 0px" },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);
  const Element = Tag as "div";
  return (
    <Element
      ref={ref as never}
      className={`reveal ${className}`.trim()}
      data-reveal={state}
      {...rest}
    >
      {children}
    </Element>
  );
}

function Icon({ name }: { name: "check" | "arrow" | "copy" }) {
  const paths = {
    check: "m5 12 4 4L19 6",
    arrow: "M7 17 17 7M7 7h10v10",
    copy: "M9 9h11v11H9zM15 5V3H3v12h2",
  };
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d={paths[name]} />
    </svg>
  );
}

/** Primary action shared by the hero and the closing section: copies the install command. */
export function InstallCta({ copied, onCopy }: { copied: boolean; onCopy: () => void }) {
  return (
    <Button className="install-cta" onClick={onCopy}>
      <Icon name={copied ? "check" : "copy"} />
      {copied ? "Copied to clipboard" : "Copy the install command"}
    </Button>
  );
}

export function Benefits() {
  return (
    <Reveal as="section" className="landing-section" aria-labelledby="benefits-title" id="benefits">
      <div className="landing-heading">
        <p className="landing-eyebrow">Why teams use it</p>
        <h2 id="benefits-title">Design once. Ship the same quality in every product.</h2>
      </div>
      <ul className="benefit-grid">
        {benefits.map((item) => (
          <li key={item.title} className="benefit-card">
            <h3>{item.title}</h3>
            <p>{item.body}</p>
            <Badge tone="neutral">{item.proof}</Badge>
          </li>
        ))}
      </ul>
    </Reveal>
  );
}

export function TaglineReveal() {
  const ref = useRef<HTMLParagraphElement>(null);
  const [armed, setArmed] = useState(false);
  useEffect(() => {
    const root = ref.current;
    if (!root || reducedMotion() || typeof IntersectionObserver === "undefined") return;
    const words = Array.from(root.querySelectorAll<HTMLElement>("[data-word]"));
    setArmed(true);
    // Each word turns on once it crosses a trigger line 40% up from the bottom of the viewport.
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting && entry.boundingClientRect.top > 0) continue;
          (entry.target as HTMLElement).dataset.active = "true";
          observer.unobserve(entry.target);
        }
      },
      { rootMargin: "0px 0px -40% 0px", threshold: 0 },
    );
    for (const word of words) observer.observe(word);
    return () => observer.disconnect();
  }, []);
  return (
    <section className="tagline" aria-label="Our promise">
      <p className="sr-only">{tagline.join(" ")}</p>
      <p className="tagline__text" ref={ref} data-armed={armed} aria-hidden="true">
        {tagline
          .join(" ")
          .split(" ")
          .map((word, index) => (
            <span key={`${word}-${index}`} data-word>
              {word}{" "}
            </span>
          ))}
      </p>
    </section>
  );
}

export function HowItWorks() {
  return (
    <Reveal as="section" className="landing-section" aria-labelledby="how-title" id="how-it-works">
      <div className="landing-heading">
        <p className="landing-eyebrow">How it works</p>
        <h2 id="how-title">Running in your app in three steps.</h2>
      </div>
      <ol className="step-list">
        {steps.map((step, index) => (
          <li key={step.title} className="step-card">
            <span className="step-card__number" aria-hidden="true">
              {index + 1}
            </span>
            <h3>{step.title}</h3>
            <p>{step.body}</p>
            <code>{step.code}</code>
          </li>
        ))}
      </ol>
    </Reveal>
  );
}

export function Faq() {
  return (
    <Reveal as="section" className="landing-section" aria-labelledby="faq-title" id="faq">
      <div className="landing-heading">
        <p className="landing-eyebrow">Questions</p>
        <h2 id="faq-title">What teams ask before they install.</h2>
      </div>
      <Accordion type="single" className="faq-list">
        {faq.map((item) => (
          <AccordionItem key={item.question} title={item.question}>
            <p>{item.answer}</p>
          </AccordionItem>
        ))}
      </Accordion>
    </Reveal>
  );
}

export function RiskReversal() {
  return (
    <Reveal as="section" className="risk-row" aria-labelledby="risk-title">
      <h2 id="risk-title" className="sr-only">
        No lock in
      </h2>
      <ul>
        {riskReversal.map((item) => (
          <li key={item}>
            <Icon name="check" />
            {item}
          </li>
        ))}
      </ul>
    </Reveal>
  );
}

export { installCommand };
