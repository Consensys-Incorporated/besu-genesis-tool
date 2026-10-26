#!/usr/bin/env node
import { main } from "./index.ts";

main().catch((err: unknown) => {
  if (err instanceof Error) {
    if (err.stack && process.argv.includes("--stackTraceOnError")) {
      console.error(`Fatal error: ${err.stack}`);
    } else {
      console.error(`Fatal error: ${err.message}`);
    }
  } else if (err) {
    console.error("Fatal error:", err);
  } else {
    console.error(`Fatal error: unknown`);
  }
  process.exit(1);
});
