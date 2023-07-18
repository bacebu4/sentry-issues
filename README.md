This extensions allows you to preview, resolve or ignore Sentry issues right inside VSCode.

![Demo image](https://raw.githubusercontent.com/bacebu4/sentry-issues/main/img/demo.png)

## Features

- Preview unresolved issues
- Resolve or ignore them

## Commands (5)

| Command                 | Description                                                    |
| ----------------------- | -------------------------------------------------------------- |
| sentryIssues.logout     | Sentry Issues: Remove provided credentials for Sentry instance |
| issueView.refreshEntry  | Sentry Issues: Fetch unresolved issues for each project        |
| issueView.ignoreIssue   | Sentry Issues: Ignore selected issue                           |
| issueView.resolveIssue  | Sentry Issues: Resolve selected issue                          |
| issueView.openInBrowser | Sentry Issues: Open selected issue in VSCode browser           |

## Known Limitations

- Only first 50 unresolved issues per each project are displayed
- Only one instance URL of Sentry is supported

## FAQ

### How to install the extension?

Type `bacebu4.sentry-issues` into Extension search and click `Install` button.
