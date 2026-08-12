# bunnext

A minimal, client-rendered React framework using Bun's native server and bundler with React Router.

## Routes

```text
app/page.tsx                 -> /
app/about/page.tsx           -> /about
app/blog/[id]/page.tsx       -> /blog/:id
app/docs/[...slug]/page.tsx  -> /docs/*
```

Each page default-exports a React component. Optional `loader`, `action`, and `ErrorBoundary` exports follow React Router's route module API. Loaders run in the browser.

## Usage

```bash
bun add react react-dom bunnext
bunx bunnext dev
```

Commands:

```bash
bunnext dev
bunnext build
bunnext start
```

`dev` generates the route manifest and starts Bun with HMR. `build` writes a production full-stack bundle to `dist/`. Every non-API URL serves the SPA shell; React Router handles matching in the browser.
