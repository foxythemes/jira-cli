---
title: "Getting started"
headless: true
weight: 3
active: true
---

**JIRA CLI** uses the power of [JIRA API](https://docs.atlassian.com/jira/REST/cloud/) to perform all the different actions and queries.

When running the first time, it will ask you for:

*   JIRA host {{< text-muted "(example.atlassian.net)" >}}
*   User name
*   Password
*   Enable https protocol

After that it will create a new config in `"~/.jira-cli.json"` with this data, you can create or modify this file manually, to run this initial setup you just need to enter the main command like this:

{{< highlight bash >}}
jira
{{< /highlight >}}