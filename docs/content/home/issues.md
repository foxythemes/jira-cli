---
title: "Issues"
headless: true
weight: 6
active: true
---

Depending on how your organization is using JIRA, an issue could represent a software bug, a project task, a helpdesk ticket, a leave request form, etc.

By default `jira issue` or `jira i` shows all the open issues assigned to you.

{{< terminal >}}
jira issue <command> [options]
{{< /terminal >}}

##### Commands
<table class="table">
    <thead>
        <tr>
            <th>Description</th>
            <th>Command</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>Create a new issue</td>
            <td><code>create</code></td>
        </tr>
    </tbody>
</table>


##### Options
<table class="table">
    <thead>
        <tr>
            <th>Description</th>
            <th>Option</th>
            <th>Alias</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>Filter issues by project</td>
            <td><code>--project &lt;project key&gt;</code></td>
            <td><code>-p &lt;project key&gt;</code></td>
        </tr>
        <tr>
            <td>Filter issues by user name</td>
            <td><code>--user &lt;user name&gt;</code></td>
            <td><code>-u &lt;user name&gt;</code></td>
        </tr>
        <tr>
            <td>Filter issues by release</td>
            <td><code>--release &lt;release name&gt;</code></td>
            <td><code>-r &lt;release name&gt;</code></td>
        </tr>
    </tbody>
</table>
