// Ambient types for assets Bun's bundler understands.
// Apps opt in via tsconfig: { "compilerOptions": { "types": ["littlecrumb/env"] } }

declare module "*.css";

declare module "*.svg" {
  const url: string;
  export default url;
}

declare module "*.png" {
  const url: string;
  export default url;
}

declare module "*.jpg" {
  const url: string;
  export default url;
}

declare module "*.jpeg" {
  const url: string;
  export default url;
}

declare module "*.gif" {
  const url: string;
  export default url;
}

declare module "*.webp" {
  const url: string;
  export default url;
}

declare module "*.ico" {
  const url: string;
  export default url;
}
