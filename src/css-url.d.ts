// Vite resolves `?url` imports (used by the showcase theme loader, which a unit test imports).
declare module "*.css?url" {
  const url: string;
  export default url;
}
