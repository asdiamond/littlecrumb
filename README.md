# littlecrumb

A minimal, client-rendered React framework using Bun's native server and bundler with React Router.

## Pages

```text
app/page.tsx                 -> /
app/about/page.tsx           -> /about
app/blog/[id]/page.tsx       -> /blog/:id
app/docs/[...slug]/page.tsx  -> /docs/*
```

Each page default-exports a React component. Optional `loader`, `action`, and `ErrorBoundary` exports follow React Router's route module API. Loaders run in the browser.

## API routes

```text
app/api/users/route.ts       -> /api/users
app/api/users/[id]/route.ts  -> /api/users/:id
```

A `route.ts` exports one handler per HTTP method, served directly by `Bun.serve`:

```ts
export function GET(request: Bun.BunRequest<"/api/users/:id">) {
  return Response.json({ id: request.params.id });
}

export async function POST(request: Bun.BunRequest) {
  const body = await request.json();
  return Response.json(body, { status: 201 });
}
```

Supported methods: `GET`, `POST`, `PUT`, `PATCH`, `DELETE`, `HEAD`, `OPTIONS`. Unhandled methods return 405. API routes take precedence over the SPA shell; a `page.tsx` and `route.ts` mapping to the same path is a generate-time error.

## Usage

```bash
bun add react react-dom littlecrumb
bunx littlecrumb dev
```

Commands:

```bash
littlecrumb dev
littlecrumb build
littlecrumb start
```

`dev` generates the route manifest and starts Bun with HMR. `build` writes a production full-stack bundle to `dist/`. Every non-API URL serves the SPA shell; React Router handles matching in the browser.
