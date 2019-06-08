---
title: "Getting started"
headless: true
weight: 3
active: true
---

**JIRA CLI** uses the jira rest [API](https://docs.atlassian.com/jira/REST/cloud/) to perform all the different actions and queries.

When running the first time, it will ask you for:

*   JIRA host {{< text-muted "(example.atlassian.net)" >}}
*   Email
*   [Password (API Token)](https://confluence.atlassian.com/cloud/api-tokens-938839638.html)
*   Enable https protocol

After that a new config file will be created in `"~/.jira-cli.json"`, you can create or modify this file manually. In order to run this initial setup you just need to enter the main command:

{{< terminal >}}
jira
{{< /terminal >}}