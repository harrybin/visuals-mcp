/**
 * Publishes to MCP Registry, auto-refreshing the token if expired.
 * Runs sync-server-version first, then attempts publish.
 * If the token is expired, re-authenticates via `mcp-publisher login github`
 * and retries once.
 */
const { execSync } = require("child_process");
const path = require("path");

const cwd = path.join(__dirname, "..");
const publisher = ".\\mcp-publisher.exe";

// Sync version first
console.log("Syncing server.json version...");
execSync("npm run sync-server-version", { stdio: "inherit", cwd });

function publish() {
  return execSync(`${publisher} publish`, { stdio: "pipe", cwd });
}

try {
  publish();
  console.log("Published to MCP Registry successfully.");
} catch (e) {
  const output = [e.stderr, e.stdout, e.message]
    .map((s) => (s || "").toString())
    .join("\n");

  if (
    output.includes("expired") ||
    output.includes("401") ||
    output.includes("Unauthorized")
  ) {
    console.log("Token expired — re-authenticating via GitHub...");
    execSync(`${publisher} login github`, { stdio: "inherit", cwd });

    console.log("Retrying publish...");
    try {
      publish();
      console.log("Published to MCP Registry successfully.");
    } catch (retryErr) {
      const retryOutput = [retryErr.stderr, retryErr.stdout]
        .map((s) => (s || "").toString())
        .join("\n");
      if (
        retryOutput.includes("already exists") ||
        retryOutput.includes("same version")
      ) {
        console.log("Version already published to MCP Registry — skipping.");
      } else {
        if (retryErr.stderr) process.stderr.write(retryErr.stderr);
        if (retryErr.stdout) process.stdout.write(retryErr.stdout);
        process.exit(1);
      }
    }
  } else if (
    output.includes("already exists") ||
    output.includes("same version")
  ) {
    console.log("Version already published to MCP Registry — skipping.");
  } else {
    if (e.stderr) process.stderr.write(e.stderr);
    if (e.stdout) process.stdout.write(e.stdout);
    process.exit(1);
  }
}
