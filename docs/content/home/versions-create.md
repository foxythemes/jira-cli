---
title: "Creating Versions"
headless: true
weight: 11
active: true
---

You can also create versions by passing the number version you want to create as parameter like this:


{{< terminal >}}
jira version <project key> <version number> [options]
{{< /terminal >}}

#### Options
You can set the description, start and release date by passing the following options:

<table class="table">
    <thead>
        <tr>
            <th>Description</th>
            <th>Option</th>
            <th>Example</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>Version detail</td>
            <td><code>--description &lt;project key&gt; &lt;description&gt;</code></td>
            <td><code>jira version PK -d "Description"</code></td>
        </tr>
        <tr>
            <td>Start date</td>
            <td><code>--start-date &lt;date in "d/MMM/yy" format&gt;</code></td>
            <td><code>jira version PK -s "13/Aug/2017"</code></td>
        </tr>
        <tr>
            <td>Release date</td>
            <td><code>--release-date &lt;date in "d/MMM/yy" format&gt;</code></td>
            <td><code>jira version PK -r "13/Aug/2017"</code></td>
        </tr>
    </tbody>
</table>