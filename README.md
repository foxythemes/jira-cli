# jira-cli

This is a command line client Jira API, useful to create new issues.

## Getting Started

*  Install with npm: `npm install -g jira-cl`
*  Run it with `jira [command] [arguments]`

### Initial Setup
When running the first time (or if you didn't create a config file), it will ask you for your Jira host, username, password and if you use 'https' protocol and a new config file will be created in `~/.jira-cli.json` with this data. You can create or modify this file manually.

## Usage

There is only one main command `create` if no command is provided help is shown:

```
  Usage:  [options] [command]


  Commands:

    create [options] [options]     Create a new issue
    open|o [options]               Open issues in browser
    config [options] [command]     Configuration file options
    issue|i [options] [command]    Issue commands
    project|p [options] [command]  Project commands
    version|v <project>            Get project versions

  Options:

    -h, --help     output usage information
    -V, --version  output the version number

```

## License

Copyright (c) 2016 Behuti
Licensed under the MIT license.
