#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

const repoRoot = path.resolve(__dirname, "..");
const args = process.argv.slice(2);

function getArgValue(flag) {
  const idx = args.indexOf(flag);
  if (idx === -1) return null;
  return args[idx + 1] || null;
}

const outPathArg = getArgValue("--out");
const includeGenerated = args.includes("--include-generated");
const includeBinary = args.includes("--include-binary");

const excludedDirs = new Set([
  ".git",
  "node_modules",
  "dist",
  "out",
  "storybook-static",
  "coverage",
]);

const languageByExt = {
  ".ts": "TypeScript",
  ".tsx": "TypeScript/React",
  ".js": "JavaScript",
  ".jsx": "JavaScript/React",
  ".cjs": "CommonJS",
  ".mjs": "JavaScript Module",
  ".json": "JSON",
  ".css": "CSS",
  ".html": "HTML",
  ".md": "Markdown",
  ".yml": "YAML",
  ".yaml": "YAML",
  ".sh": "Shell",
  ".ps1": "PowerShell",
  ".png": "Image",
  ".jpg": "Image",
  ".jpeg": "Image",
  ".gif": "Image",
  ".svg": "Image",
  ".webp": "Image",
  ".bmp": "Image",
  ".lock": "Lockfile",
};

const textLikeExtensions = new Set([
  ".ts",
  ".tsx",
  ".js",
  ".jsx",
  ".cjs",
  ".mjs",
  ".json",
  ".css",
  ".html",
  ".md",
  ".yml",
  ".yaml",
  ".sh",
  ".ps1",
  ".txt",
  ".xml",
  ".svg",
  "[no_ext]",
]);

function countLines(text) {
  if (!text) return 0;
  return text.split(/\r?\n/).length;
}

function walkFiles(baseDir) {
  const result = [];
  const entries = fs.readdirSync(baseDir, { withFileTypes: true });
  for (const entry of entries) {
    const abs = path.join(baseDir, entry.name);
    const rel = path.relative(repoRoot, abs).split(path.sep).join("/");

    if (entry.isDirectory()) {
      if (!includeGenerated && excludedDirs.has(entry.name)) {
        continue;
      }
      result.push(...walkFiles(abs));
      continue;
    }

    if (entry.isFile()) {
      result.push({ abs, rel });
    }
  }
  return result;
}

function getExt(file) {
  const ext = path.extname(file).toLowerCase();
  return ext || "[no_ext]";
}

function aggregate(records, keyName) {
  const map = new Map();
  for (const row of records) {
    const key = row[keyName];
    if (!map.has(key)) {
      map.set(key, { [keyName]: key, files: 0, lines: 0 });
    }
    const curr = map.get(key);
    curr.files += 1;
    curr.lines += row.lines;
  }
  return Array.from(map.values()).sort((a, b) => b.lines - a.lines);
}

function getPackageStats() {
  const pkgPath = path.join(repoRoot, "package.json");
  if (!fs.existsSync(pkgPath)) {
    return {
      npmScripts: 0,
      dependencies: 0,
      devDependencies: 0,
    };
  }

  const pkg = JSON.parse(fs.readFileSync(pkgPath, "utf8"));
  return {
    npmScripts: Object.keys(pkg.scripts || {}).length,
    dependencies: Object.keys(pkg.dependencies || {}).length,
    devDependencies: Object.keys(pkg.devDependencies || {}).length,
  };
}

const files = walkFiles(repoRoot);
const records = files
  .map((f) => {
    let text = "";
    try {
      text = fs.readFileSync(f.abs, "utf8");
    } catch (_err) {
      text = "";
    }

    const ext = getExt(f.rel);
    const language = languageByExt[ext] || "Other";
    return {
      file: f.rel,
      extension: ext,
      language,
      lines: countLines(text),
    };
  })
  .filter((r) => includeBinary || textLikeExtensions.has(r.extension));

const byExtension = aggregate(
  records.map((r) => ({ ext: r.extension, lines: r.lines })),
  "ext",
);
const byLanguage = aggregate(
  records.map((r) => ({ language: r.language, lines: r.lines })),
  "language",
);

const topExtensions = byExtension.slice(0, 12);
const sourceFiles = records.filter((r) =>
  [".ts", ".tsx", ".js", ".jsx", ".css", ".html", ".md"].includes(r.extension),
);

const totalLines = records.reduce((sum, r) => sum + r.lines, 0);
const totalFiles = records.length;

const productMetrics = {
  mcpHtmlEntryPoints: [
    "mcp-table.html",
    "mcp-image.html",
    "mcp-chart.html",
    "mcp-master-detail.html",
    "mcp-tree.html",
    "mcp-list.html",
  ].filter((p) => fs.existsSync(path.join(repoRoot, p))).length,
  viteConfigFiles: files.filter((f) =>
    /(^|\/)vite\.config(\..+)?\.ts$/.test(f.rel),
  ).length,
  storybookStories: files.filter((f) => /^src\/.*\.stories\.tsx$/.test(f.rel))
    .length,
  ...getPackageStats(),
};

const payload = {
  generatedAt: new Date().toISOString(),
  scope: includeGenerated ? "full-repo" : "source-focused",
  includeBinary,
  totals: {
    files: totalFiles,
    lines: totalLines,
    sourceFiles: sourceFiles.length,
    sourceLines: sourceFiles.reduce((sum, r) => sum + r.lines, 0),
  },
  byLanguage,
  byExtensionTop12: topExtensions,
  productMetrics,
};

const json = JSON.stringify(payload, null, 2) + "\n";

if (outPathArg) {
  const absOut = path.isAbsolute(outPathArg)
    ? outPathArg
    : path.join(repoRoot, outPathArg);
  fs.mkdirSync(path.dirname(absOut), { recursive: true });
  fs.writeFileSync(absOut, json, "utf8");
}

process.stdout.write(json);
