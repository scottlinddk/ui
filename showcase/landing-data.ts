/** Landing page copy. The FAQ here is mirrored in the FAQPage JSON-LD in index.html; a test keeps them in sync. */

export const installCommand = "npm install @scttlnd/ui";

export const benefits = [
  {
    title: "One palette across every product",
    body: "Funder, Investor and Portare read the same --fds tokens, so a design change reaches all of them with a version bump instead of three rewrites.",
    proof: "Eleven themes ship in the package.",
  },
  {
    title: "Accessibility you do not rebuild",
    body: "Visible focus rings, semantic HTML, reduced motion, 44px touch targets and 16px mobile form text come built in.",
    proof: "Checked with axe in every theme.",
  },
  {
    title: "Ship only what you use",
    body: "Every component is its own module, so your bundler drops the ones you never import.",
    proof: "Enforced by the package test suite.",
  },
  {
    title: "Override without a specificity fight",
    body: "Package styles live in a cascade layer, so ordinary CSS in your app always wins.",
    proof: "Verified by a browser test.",
  },
] as const;

export const steps = [
  {
    title: "Install the package",
    body: "Add @scttlnd/ui to your React app from npm.",
    code: installCommand,
  },
  {
    title: "Import the styles once",
    body: "Studio is the default. For a product theme, import exactly one theme file after it.",
    code: 'import "@scttlnd/ui/styles.css";',
  },
  {
    title: "Compose your screens",
    body: "Use the components. Formatting, money maths and API calls stay in your app.",
    code: 'import { Button, Panel } from "@scttlnd/ui";',
  },
] as const;

export const faq = [
  {
    question: "What is Scttlnd UI?",
    answer:
      "Scttlnd UI is a shared set of design tokens and React components used by Funder, Investor and Portare. It is published on npm as @scttlnd/ui.",
  },
  {
    question: "Which frameworks does it support?",
    answer:
      "It works with React 18 and React 19. Components that need client state carry a use client directive, so they also work in the Next.js App Router.",
  },
  {
    question: "How do I choose a theme?",
    answer:
      "Import styles.css at the app root. Studio is the default. For Funder, Investor or Portare, import exactly one product theme file after it.",
  },
  {
    question: "Will it fight with my existing CSS?",
    answer:
      "No. Package styles sit in a cascade layer named fds, so normal unlayered CSS in your app overrides them regardless of specificity or import order.",
  },
  {
    question: "Does it include formatting, charts or API clients?",
    answer:
      "No. Financial maths, API clients, user state, authentication and business specific charts stay in your app. Components receive pre formatted strings.",
  },
  {
    question: "Does it load fonts or make network requests?",
    answer:
      "No. The package loads no fonts and makes no network requests. Load DM Sans yourself or point the font token at your own brand font.",
  },
  {
    question: "How are releases handled?",
    answer:
      "Releases are automated with Changesets and published to npm with trusted publishing. Pin one version per app and review upgrades with visual checks.",
  },
  {
    question: "What license is it under?",
    answer: "It is open source under the MIT license, and the code is on GitHub.",
  },
] as const;

export const riskReversal = [
  "MIT licensed and open source",
  "No fonts or network requests added to your app",
  "Your own CSS always wins the cascade",
] as const;

export const tagline = [
  "Make each design decision once.",
  "Every product inherits it,",
  "and nobody rebuilds a button again.",
] as const;
