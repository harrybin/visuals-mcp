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
  // Set scoped name for npm publish
  pkg.name = "@harrybin/visuals-mcp";
  fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 4) + "\n");

  console.log(
    `Publishing @harrybin/visuals-mcp@${pkg.version} to ${registryUrl}...`,
  );
  try {
    execSync(`npm publish --registry ${registryUrl} --access public`, {
      stdio: "pipe",
      cwd: path.join(__dirname, ".."),
    });
    console.log("Published successfully.");
  } catch (e) {
    const output = [e.stderr, e.stdout, e.message]
      .map((s) => (s || "").toString())
      .join("\n");
    // If this version is already published, skip gracefully
    if (
      output.includes("previously published versions") ||
      output.includes("Cannot publish over")
    ) {
      console.log(
        `Version ${pkg.version} already published to ${registryUrl} — skipping.`,
      );
    } else {
      // Print the captured output so the user can see what went wrong
      if (e.stderr) process.stderr.write(e.stderr);
      if (e.stdout) process.stdout.write(e.stdout);
      throw e;
    }
  }
} finally {
  // Always restore original unscoped name (required for vsce)
  pkg.name = originalName;
  fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 4) + "\n");
}
