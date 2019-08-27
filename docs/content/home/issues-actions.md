---
title: "Issue Actions"
headless: true
weight: 7
active: true
---

We can also access to specific issue actions by inserting the issue id.

{{< terminal >}}
jira issue <issue key> [options]
{{< /terminal >}}

<table class="table">
    <thead>
        <tr>
            <th style="width: 30%;">Description</th>
            <th>Command</th>
            <th>Alias</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>Assign issue to user</td>
            <td><code>--assign &lt;username&gt;</code></td>
            <td><code>-a &lt;username&gt;</code></td>
        </tr>
        <tr>
            <td>Execute issue transition <br><small>if no transition name is passed it executes the next available one.</small></td>
            <td><code>--transition [transition name]</code></td>
            <td><code>-t [transition name]</code></td>
        </tr>
        <tr>
            <td>Assign issue to user</td>
            <td><code>--assign &lt;username&gt;</code></td>
            <td><code>-a &lt;username&gt;</code></td>
        </tr>
        <tr>
            <td>Add comment to issue</td>
            <td><code>--comment &lt;comment&gt;</code></td>
            <td><code>-c &lt;comment&gt;</code></td>
        </tr>
    </tbody>
</table>
