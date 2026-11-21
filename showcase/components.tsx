import { createRoot } from "react-dom/client";
import { AllComponents } from "./AllComponents.js";
import { applyThemeFromUrl } from "./theme.js";
import "../styles/index.css";
import "./showcase.css";
import "./components-page.css";

const { theme, mode } = applyThemeFromUrl();
createRoot(document.getElementById("root")!).render(
  <AllComponents initialMode={mode} theme={theme} />,
);
