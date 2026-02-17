/**
 * Publishes to npm/GitHub Packages under the scoped name @harrybin/visuals-mcp,
 * then always restores the unscoped name (required for VS Code extension).
 *
 * Usage: node scripts/npm-publish.js <registry-url>
 *   e.g. node scripts/npm-publish.js https://registry.npmjs.org
 *        node scripts/npm-publish.js https://npm.pkg.github.com
 */
const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");

const registryUrl = process.argv[2];
if (!registryUrl) {
  console.error("Usage: node scripts/npm-publish.js <registry-url>");
  process.exit(1);
}

const pkgPath = path.join(__dirname, "..", "package.json");
const pkg = JSON.parse(fs.readFileSync(pkgPath, "utf-8"));
const originalName = pkg.name;

try {
  // Set scoped name and restore type:module for npm publish
  pkg.name = "@harrybin/visuals-mcp";
  pkg.type = "module";
  fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 4) + "\n");

  console.log(`Publishing @harrybin/visuals-mcp to ${registryUrl}...`);
  execSync(`npm publish --registry ${registryUrl} --access public`, {
    stdio: "inherit",
    cwd: path.join(__dirname, ".."),
  });
} finally {
  // Always restore original name and remove type:module
  pkg.name = originalName;
  delete pkg.type;
  fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 4) + "\n");
}
