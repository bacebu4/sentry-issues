import { Command, TextDocumentShowOptions, Uri } from 'vscode';
import { VS_COMMANDS } from '../shared';

export class OpenIssueCommand implements Command {
  constructor(private readonly uri: Uri) {}

  get title() {
    return 'Open Issue';
  }

  get command() {
    return VS_COMMANDS.open;
  }

  get arguments() {
    return [this.uri, this.options];
  }

  private get options(): TextDocumentShowOptions {
    return { preview: true };
  }
}
