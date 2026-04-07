const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");

const cwd = path.join(__dirname, "..");
const isDryRun = process.argv.includes("--dry-run");

function run(command, options = {}) {
  return execSync(command, {
    cwd,
    stdio: options.stdio || "pipe",
    encoding: "utf-8",
  }).trim();
}

function fail(message) {
  console.error(message);
  process.exit(1);
}

let packageJson;

try {
  packageJson = JSON.parse(
    fs.readFileSync(path.join(cwd, "package.json"), "utf-8"),
  );
} catch (error) {
  fail(`Failed to read package.json: ${error.message}`);
}

const version = packageJson.version;
if (!version) {
  fail("package.json is missing a version field.");
}

const tagName = `v${version}`;

try {
  run("git rev-parse --is-inside-work-tree");
} catch {
  fail("This command must be run inside a git repository.");
}

const existingTag = run(`git tag --list ${tagName}`);
if (existingTag === tagName) {
  console.log(`Git tag ${tagName} already exists — skipping.`);
  process.exit(0);
}

const headCommit = run("git rev-parse --short HEAD");

if (isDryRun) {
  console.log(
    `Dry run: would create annotated tag ${tagName} at ${headCommit}.`,
  );
  process.exit(0);
}

run(`git tag -a ${tagName} -m "Release ${tagName}"`, { stdio: "inherit" });
console.log(`Created annotated git tag ${tagName} at ${headCommit}.`);
