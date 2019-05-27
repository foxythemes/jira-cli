---
title: "Configuration"
headless: true
weight: 5
active: true
---

As seen in the [Getting Started](#introduction-getting-started), we use a config file to save the user auth data in your computer. There are some commands to manipulate this file.

{{< terminal >}}
jira config <command>
{{< /terminal >}}

<table class="table">
    <thead>
        <tr>
            <th>Description</th>
            <th>Command</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>Update the JIRA host</td>
            <td><code>host</code></td>
        </tr>
        <tr>
            <td>Update username</td>
            <td><code>username</code></td>
        </tr>
        <tr>
            <td>Remove config file </td>
            <td><code>remove</code></td>
        </tr>
        <tr>
            <td>Set default board </td>
            <td><code>board --set</code></td>
        </tr>
    </tbody>
</table>
