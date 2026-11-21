import { createRoot } from "react-dom/client";
import { Showcase } from "./Showcase.js";
import { applyThemeFromUrl } from "./theme.js";
import "../styles/index.css";
import "./showcase.css";

const { theme, mode } = applyThemeFromUrl();
createRoot(document.getElementById("root")!).render(<Showcase theme={theme} initialMode={mode} />);
