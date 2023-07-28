[![Version](https://img.shields.io/visual-studio-marketplace/v/bacebu4.sentry-issues)](https://marketplace.visualstudio.com/items?itemName=bacebu4.sentry-issues)
[![Installs](https://img.shields.io/visual-studio-marketplace/i/bacebu4.sentry-issues)](https://marketplace.visualstudio.com/items?itemName=bacebu4.sentry-issues)
[![Rating](https://img.shields.io/visual-studio-marketplace/r/bacebu4.sentry-issues)](https://marketplace.visualstudio.com/items?itemName=bacebu4.sentry-issues)

This extensions allows you to preview, resolve or ignore Sentry issues right inside VSCode.

![Demo image](https://raw.githubusercontent.com/bacebu4/sentry-issues/main/img/demo.png)

![Second demo image](https://raw.githubusercontent.com/bacebu4/sentry-issues/main/img/demo2.png)

## Features

- Preview unresolved issues
- Resolve or ignore them

## Commands (6)

| Command                 | Description                                                    |
| ----------------------- | -------------------------------------------------------------- |
| sentryIssues.logout     | Sentry Issues: Remove provided credentials for Sentry instance |
| issueView.refreshEntry  | Sentry Issues: Fetch unresolved issues for each project        |
| issueView.ignoreIssue   | Sentry Issues: Ignore selected issue                           |
| issueView.resolveIssue  | Sentry Issues: Resolve selected issue                          |
| issueView.openInBrowser | Sentry Issues: Open selected issue in VSCode browser           |
| issueView.copyIssueLink | Sentry Issues: Copy issue link to clipboard                    |

## Known Limitations

- Only first 50 unresolved issues per each project are displayed
- Only one instance URL of Sentry is supported
- Tags are calculated only on latest 50 events of issue

## FAQ

### How to install the extension?

Type `bacebu4.sentry-issues` into Extension search and click `Install` button.
