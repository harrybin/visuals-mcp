/**
 * Publishes to VS Code Marketplace using the MARKETPLACE_TOKEN from .env
 */
const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");

// Load .env file
const envPath = path.join(__dirname, "..", ".env");
if (!fs.existsSync(envPath)) {
  console.error("Error: .env file not found. Create one with MARKETPLACE_TOKEN=<your-pat>");
  process.exit(1);
}

const envContent = fs.readFileSync(envPath, "utf-8");
for (const line of envContent.split("\n")) {
  const trimmed = line.trim();
  if (!trimmed || trimmed.startsWith("#")) continue;
  const eqIndex = trimmed.indexOf("=");
  if (eqIndex === -1) continue;
  const key = trimmed.slice(0, eqIndex).trim();
  const value = trimmed.slice(eqIndex + 1).trim();
  process.env[key] = value;
}

const token = process.env.MARKETPLACE_TOKEN;
if (!token) {
  console.error("Error: MARKETPLACE_TOKEN not found in .env file");
  process.exit(1);
}

const pkg = JSON.parse(fs.readFileSync(path.join(__dirname, "..", "package.json"), "utf-8"));
console.log(`Publishing ${pkg.name}@${pkg.version} to VS Code Marketplace...`);

try {
  execSync(`vsce publish -p ${token}`, {
    stdio: "pipe",
    cwd: path.join(__dirname, ".."),
  });
  console.log("Published successfully.");
} catch (e) {
  const output = [e.stderr, e.stdout, e.message].map(s => (s || "").toString()).join("\n");
  if (output.includes("already exists") || output.includes("Version")) {
    console.log(`Version ${pkg.version} may already be published — skipping.`);
  } else {
    if (e.stderr) process.stderr.write(e.stderr);
    if (e.stdout) process.stdout.write(e.stdout);
    process.exit(1);
  }
}
