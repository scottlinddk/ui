import boligdata from "../styles/themes/boligdata.css?url";
import caffeine from "../styles/themes/caffeine.css?url";
import exclusive from "../styles/themes/exclusive.css?url";
import classic from "../styles/themes/classic.css?url";
import funder from "../styles/themes/funder.css?url";
import investor from "../styles/themes/investor.css?url";
import nuance from "../styles/themes/nuance.css?url";
import orbit from "../styles/themes/orbit.css?url";
import portare from "../styles/themes/portare.css?url";
import studio from "../styles/themes/studio.css?url";
import tredjekort from "../styles/themes/tredjekort.css?url";

export const themes = {
  studio,
  classic,
  nuance,
  caffeine,
  boligdata,
  tredjekort,
  orbit,
  exclusive,
  funder,
  investor,
  portare,
};
export type ThemeName = keyof typeof themes;
export const modeThemes: readonly string[] = [
  "studio",
  "classic",
  "nuance",
  "caffeine",
  "boligdata",
  "tredjekort",
  "orbit",
  "exclusive",
];

/** Reads `?theme=` and `?mode=`, links the one theme stylesheet after the base CSS and sets data attributes. */
export function applyThemeFromUrl() {
  const params = new URLSearchParams(location.search);
  const requested = params.get("theme");
  const theme: ThemeName =
    requested && Object.hasOwn(themes, requested) ? (requested as ThemeName) : "studio";
  const mode: "light" | "dark" = params.get("mode") === "dark" ? "dark" : "light";
  const link = document.getElementById("fds-theme") as HTMLLinkElement;
  link.href = themes[theme];
  document.head.append(link); // keep the single theme after the base CSS
  document.documentElement.dataset.fdsTheme = theme;
  document.documentElement.dataset.fdsMode = mode;
  return { theme, mode };
}

/** Current query string (theme and mode) to carry between pages; empty during server rendering in tests. */
export const search = () => (typeof location === "undefined" ? "" : location.search);
