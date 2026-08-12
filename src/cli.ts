#!/usr/bin/env bun

import { watch } from "node:fs";
import { rm } from "node:fs/promises";
import path from "node:path";
import { generate, isGeneratorInput } from "./generate";

function describe(result: { pages: number; apis: number }) {
  return `${result.pages} page(s), ${result.apis} API route(s)`;
}

const root = process.cwd();
const command = Bun.argv[2] ?? "dev";
const generatedServer = path.join(root, ".littlecrumb", "server.ts");

async function runDev() {
  const result = await generate(root);
  console.log(`littlecrumb: generated ${describe(result)}`);

  const child = Bun.spawn(["bun", "--hot", generatedServer], {
    cwd: root,
    stdin: "inherit",
    stdout: "inherit",
    stderr: "inherit",
  });

  let timer: ReturnType<typeof setTimeout> | undefined;
  const watcher = watch(
    path.join(root, "app"),
    { recursive: true },
    (_event, filename) => {
      if (!isGeneratorInput(filename?.toString() ?? null)) return;

      clearTimeout(timer);
      timer = setTimeout(async () => {
        try {
          const next = await generate(root);
          console.log(`littlecrumb: regenerated ${describe(next)}`);
        } catch (error) {
          console.error(error instanceof Error ? error.message : error);
        }
      }, 50);
    },
  );

  const stop = () => {
    watcher.close();
    child.kill();
  };

  process.once("SIGINT", stop);
  process.once("SIGTERM", stop);

  const exitCode = await child.exited;
  watcher.close();
  process.exitCode = exitCode;
}

async function runBuild() {
  const generated = await generate(root);
  const outputDirectory = path.join(root, "dist");
  await rm(outputDirectory, { recursive: true, force: true });

  const result = await Bun.build({
    entrypoints: [generatedServer],
    outdir: outputDirectory,
    target: "bun",
    splitting: true,
    minify: true,
    sourcemap: "external",
  });

  if (!result.success) {
    for (const log of result.logs) console.error(log);
    process.exitCode = 1;
    return;
  }

  console.log(
    `littlecrumb: built ${describe(generated)} to ${outputDirectory}`,
  );
}

async function runStart() {
  const server = path.join(root, "dist", "server.js");
  if (!(await Bun.file(server).exists())) {
    throw new Error("littlecrumb: dist/server.js not found; run littlecrumb build first");
  }

  const child = Bun.spawn(["bun", "server.js"], {
    // Bun's split full-stack assets are resolved from the output directory.
    cwd: path.dirname(server),
    env: { ...process.env, NODE_ENV: "production" },
    stdin: "inherit",
    stdout: "inherit",
    stderr: "inherit",
  });

  const stop = () => child.kill();
  process.once("SIGINT", stop);
  process.once("SIGTERM", stop);
  process.exitCode = await child.exited;
}

try {
  if (command === "dev") await runDev();
  else if (command === "build") await runBuild();
  else if (command === "start") await runStart();
  else {
    console.error("Usage: littlecrumb <dev|build|start>");
    process.exitCode = 1;
  }
} catch (error) {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
}
