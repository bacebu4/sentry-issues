import { ExtensionContext } from 'vscode';
import { registerIssueView } from './issue/registerIssueView';

export function activate(context: ExtensionContext) {
  registerIssueView(context);
}

export function deactivate() {}
