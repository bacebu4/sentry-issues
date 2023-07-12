import { Command, TextDocumentShowOptions, Uri } from 'vscode';

export class OpenIssueCommand implements Command {
  constructor(private readonly uri: Uri) {}

  get title() {
    return 'Open Issue';
  }

  get command() {
    return 'vscode.open';
  }

  get arguments() {
    return [this.uri, this.options];
  }

  private get options(): TextDocumentShowOptions {
    return { preview: true };
  }
}
