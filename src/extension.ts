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
    let concatenatedLines = '';
    for (let i = 0; i < document.lineCount; i++) {
      const line = document.lineAt(i);
      if (line.text.includes(text)) {
        // Keep this line and concatenate it with the previous kept line
        concatenatedLines += line.text.trim() + '\n';
      }
    }
    // Replace the entire document with the concatenated lines
    const range = new vscode.Range(document.positionAt(0), document.positionAt(document.getText().length));
    edit.replace(document.uri, range, concatenatedLines);
    await vscode.workspace.applyEdit(edit);
  });

  context.subscriptions.push(disposable);
}