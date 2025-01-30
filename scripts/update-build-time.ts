#!/usr/bin/env bun

const filePath = "BUILD.json";
const buildFile: Record<string, string> = await Bun.file(filePath).json();
buildFile.build_date = new Date().toISOString();
await Bun.write(filePath, JSON.stringify(buildFile, null, 2));
