import { ExtensionContext } from 'vscode';
import { IssueView } from './issue/IssueView';

export function activate(context: ExtensionContext) {
  new IssueView(context);
}

export function deactivate() {}
