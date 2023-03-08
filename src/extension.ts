import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {
  // Register a command that prompts the user for text and removes all lines except for the lines that contain that text
  let disposable = vscode.commands.registerCommand('extension.keepLines', async () => {
    // Get the active text editor
    const editor = vscode.window.activeTextEditor;
    if (!editor) {
      return;
    }

    // Prompt the user for text
    const text = await vscode.window.showInputBox({
      prompt: 'Enter the text to keep',
    });

    if (!text) {
      return;
    }

    // Get the document and make edits to it
    const document = editor.document;
    const edit = new vscode.WorkspaceEdit();
    for (let i = 0; i < document.lineCount; i++) {
      const line = document.lineAt(i);
      if (line.text.includes(text)) {
        // Keep this line
        continue;
      } else {
        // Remove this line
        const range = new vscode.Range(line.range.start, line.range.end);
        edit.delete(document.uri, range);
      }
    }
    await vscode.workspace.applyEdit(edit);
  });

  context.subscriptions.push(disposable);
}