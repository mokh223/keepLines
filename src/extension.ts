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
      prompt: 'Enter the text to keep, separated by semicolons (;)',
      value: 'CODE_UNIT_STARTED;CODE_UNIT_FINISHED;USER_DEBUG'
    });

    if (!text) {
      return;
    }

    // Split the input into keywords
    const keywords = text.split(';');

    // Get the document and make edits to it
    const document = editor.document;
    const edit = new vscode.WorkspaceEdit();
    let concatenatedLines = '';
    for (let i = 0; i < document.lineCount; i++) {
      const line = document.lineAt(i);
      for (let j = 0; j < keywords.length; j++) {
        const keyword = keywords[j];
        if (line.text.includes(keyword)) {
          // Keep this line and concatenate it with the previous kept line
          concatenatedLines += line.text.trim() + '\n';
          break;
        }
      }
    }
    // Replace the entire document with the concatenated lines
    const range = new vscode.Range(document.positionAt(0), document.positionAt(document.getText().length));
    edit.replace(document.uri, range, concatenatedLines);
    await vscode.workspace.applyEdit(edit);
  });

  context.subscriptions.push(disposable);
}