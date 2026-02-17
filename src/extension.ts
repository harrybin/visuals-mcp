import * as vscode from "vscode";

/**
 * Activate the Visuals MCP extension.
 * This is a pure MCP server extension — its only job is to register
 * an MCP server definition so VS Code / Copilot can discover and
 * connect to the server process.
 */
export function activate(context: vscode.ExtensionContext) {
  const outputChannel = vscode.window.createOutputChannel("Visuals MCP");
  outputChannel.appendLine("Visuals MCP extension activating...");

  const didChangeEmitter = new vscode.EventEmitter<void>();

  try {
    const disposable = vscode.lm.registerMcpServerDefinitionProvider(
      "visuals-mcp",
      {
        onDidChangeMcpServerDefinitions: didChangeEmitter.event,

        provideMcpServerDefinitions: async () => {
          const serverPath = context.asAbsolutePath("dist/server.bundle.mjs");
          outputChannel.appendLine(`Providing MCP server at: ${serverPath}`);
          return [
            new vscode.McpStdioServerDefinition("visuals-mcp", "node", [
              serverPath,
            ]),
          ];
        },

        resolveMcpServerDefinition: async (
          server: vscode.McpServerDefinition,
        ) => {
          return server;
        },
      },
    );

    context.subscriptions.push(disposable, didChangeEmitter, outputChannel);
    outputChannel.appendLine("Visuals MCP extension activated successfully.");
  } catch (err) {
    outputChannel.appendLine(`Activation error: ${err}`);
    outputChannel.show();
    throw err;
  }
}

/**
 * Deactivate the extension
 */
export function deactivate() {}
