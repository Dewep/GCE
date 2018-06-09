# GCE (Global Commands Execution)

## What is GCE?

GCE is a desktop application that provides a single context to manage and run multiple scripts. [Download the latest release.](https://github.com/Dewep/GCE/releases/latest)

## Why GCE?

As web applications are being split in micro services and independant entities, it becomes harder and harder to setup a local dev environment and you have to handle dozen of shell terminals.

GCE aims to take that pain away by offering you the ability to configure the setup of your projects once and run it in the blink of an eye.

![Preview](assets/preview.png)

## Usage

You just have to create a configuration file in your `home` folder (`C:/Users/XXXX/` or `/home/XXXX/`), in a file named `gce.yml`, describing all of your commands.

```yml
---
# GCE https://github.com/Dewep/GCE


# Define default root path for all your commands
#
# Examples:
# root: C:\Users\Dewep\Documents\projects
# root: /home/dewep/workspace
root: C:\Users\Dewep\Documents\projects


# The extra commands are some common actions to your commands
# For example, you would appreciate the possibility to run a "git pull" or
# a "npm install" in your repositories before executing the main command.
#
# These action buttons are at the bottom of GCE, once you have selected a command.
#
# You can also choose to run an extra as an external program (open a real shell, git gui,
# etc.). In this case add it the option "detached: true".
#
# Each extra is defined with:
#   - An extra ID, used to connect the extra to "extra-groups", "extra-default" or
#     "commands[].extra"
#   - "name": Name of the extra command, displayed in the bottom bar
#   - "cmd": Command to exec. You can use `%dir%` to have the current directory in the
#     command. The arguments of the command will be extracted by spliting the string via
#     the spaces. If your arguments have spaces, define your command as an array
#     ("[C:\Program Files\Git\git-bash.exe, --cd=%dir%]").
#   - "detached": Run as detached/external script (explorer, shell, etc.).
#   - "success-code": Optional option, default to 0. Define the success return code. This
#     is useful only for non-detached commands.
#
# Example:
# extra:
#   shell:
#     name: Shell
#     cmd: [C:\Program Files\Git\git-bash.exe, --cd=%dir%]
#     detached: true
#   explorer:
#     name: Explorer
#     cmd: explorer.exe %dir%
#     detached: true
#   git-pull:
#     name: Git pull FF
#     cmd: git pull --ff-only
#   git-gui:
#     name: Git GUI
#     cmd: git-gui.exe
#     detached: true
#   npm: npm install
extra:
  shell:
    name: Shell
    cmd: [C:\Program Files\Git\git-bash.exe, --cd=%dir%]
    detached: true
  explorer:
    name: Explorer
    cmd: explorer.exe %dir%
    detached: true
  git-pull:
    name: Git pull FF
    cmd: git pull --ff-only
  git-gui:
    name: Git GUI
    cmd: git-gui.exe
    detached: true
  npm: npm install


# Just after, when you will choose to connect these extras to your commands, you will
# quickly find it redundant to add "git-pull" "git-gui" "git-branch" "git-fetch" to each
# of them. So you can group your extras into groups (create a "git" extra that includes
# all your "git-*" extras).
#
# Example:
# extra-groups:
#   windows: shell explorer
#   git: git-pull git-gui
#   node: npm
extra-groups:
  windows: shell explorer
  git: git-pull git-gui
  node: npm


# Always in order not to find the configuration too redundant, you can define the default
# list of extras for your commands.
#
# Example:
# extra-default: windows git node
extra-default: windows git node


# Some commands require you to update the environment before running them. So you can
# edit the env for each of your commands right after, or edit the env directly for all
# your commands with the "env" configuration.
#
# Example:
# env:
#   - GOPATH=$HOME/go
#   - PATH=$GOPATH/bin:$PATH
env:


# And now the most important part, the list of your commands.
#
# You should know that there are 2 types of commands:
#   - The commands like script, server, ... the command is started, and when it ends,
#     your script is finished, your server is stopped, everything is finished. This is
#     I guess the default case, and the one that I think will be most useful to you. In
#     this case, you just have to define the command in the "cmd" option (see below).
#   - Commands that manage another process, and therefore have 2 different commands: one
#     to start the service, one to stop it. Examples: "vagrant up" then "vagrant halt",
#     "docker-compose up" then "docker-compose stop", ... In this case, you have to
#     define 2 commands in the configuration: the one to start your service (in "cmd"),
#     and the one to stop your service (in "stop-cmd").
#
# So, each command is defined by:
#  - "name": Name of the command, displayed in the sidebar. Possibility to group the
#    commands in sections, by adding the section name followed by a "/" before the
#    name (like "Section name/Command name").
#  - "path": Optional option. This is the directory path to run the command. If this is
#    a relative path, it's append to the "root" configuration (saw above).
#  - "cmd": Command to exec. As the extra commands, the arguments of the command will be
#    extracted by spliting the string via the spaces. If your arguments have spaces,
#    define your command as an array ("[sh, say-hello-to.sh, Maigret Aurelien]").
#  - "stop-cmd": Optional option. If defined, allows to have a command to execute when
#    stopping the service. See explanation above.
#  - "extra": Optional option, default value is the "extra-default" configuration. List
#    of your extra (or extra-groups) commands (present in the bottom bar).
#  - "env": Optional option. Override some environment variables.
#  - "success-code": Optional option, default to 0. Define the success return code.
#
# Example:
# commands:
#   - name: Vagrant WorkSpace
#     cmd: vagrant up
#     stop-cmd: vagrant halt
#     extra: windows
#   - name: Watch-Later/Server
#     path: Watch-Later
#     cmd: npm start
#     env:
#       - EXTERNAL_SERVICE_API_KEY=42
#       - PATH=$HOME/external-service/bin:$PATH
#   - name: Watch-Later/Brunch watch
#     path: Watch-Later
#     cmd: npm run watch-app
commands:
  # Section "General"
  - name: Vagrant WorkSpace
    cmd: vagrant up
    stop-cmd: vagrant halt
    extra: windows

  # Section "Watch-Later"
  - name: Watch-Later/Server
    path: Watch-Later
    cmd: npm start
    env:
      - EXTERNAL_SERVICE_API_KEY=42
      - PATH=$HOME/external-service/bin:$PATH
  - name: Watch-Later/Brunch watch
    path: Watch-Later
    cmd: npm run watch-app


# I doubt that it is useful to store stdout and stderr forever. To avoid slowing down
# the application unnecessarily, there is a limit on the number of lines kept for each
# command. The default is 1000 (which is enough for most cases). But if this value does
# not suit you, you are free to modify it.
#
# Example:
# lines-limit: 1000
```

## Troubleshooting

### Relative path in the command

```yml
commands:
  - name: Does not work
    path: directory/to/project
    cmd: ./bin/run.sh

  - name: Solution 1
    path: directory/to/project/bin
    cmd: run.sh
  - name: Solution 2
    path: directory/to/project
    cmd: sh ./bin/run.sh
```

### Custom env PATH on Windows

On Windows, the `PATH` env use `;` as separator (because `:` is used in `C:\`) (try to run `env` in `cmd.exe`).

However, in `git-bash.exe`, `PATH` use `:`, and windows path are replaced by an Unix notation: `/c/Program Files/Git/bin`.

To be perfectly honest, I'm a little confused about what's really used in GCE, and it may also depend on NodeJS. So in case you want to custom your `PATH` variable, try the Unix notation for Windows paths, or, if it doesn't work, use the `;` separator.

```yml
# Does not work
env:
  - PATH=C:\Program Files\Git\bin:$PATH

# Possible solution
env:
  - PATH=/c/Program Files/Git/bin:$PATH

# Another possible solution
env:
  - PATH=C:\Program Files\Git\bin;$PATH
```

If you want to test, just create a temporary `env` command:

```yml
commands:
  - name: Env test
    cmd: env
```

## Build

Requirements: NodeJS. I haven't tested it, but I think it should work from Node 6.x. Tested on NodeJS 8.9.4 (npm 5.6.0).

```bash
$> git clone git@github.com:Dewep/GCE.git
$> cd GCE
$> npm install
$> npm run dist
```

## Credits

- Colors (Tomorrow night): [chriskempson/tomorrow-theme](https://github.com/chriskempson/tomorrow-theme#tomorrow-night)
- Font family (Ubuntu font): [design.ubuntu.com](https://design.ubuntu.com/font/)
- Icon made by [Smashicons](https://www.flaticon.com/authors/smashicons) from [www.flaticon.com](https://www.flaticon.com): https://www.flaticon.com/free-icon/chip_141007
- Desktop webapp: [electronjs.org](https://electronjs.org)
- NodeJS package to parse yaml: [nodeca/js-yaml](https://github.com/nodeca/js-yaml)
- NodeJS package to kill trees of processes: [pkrumins/node-tree-kill](https://github.com/pkrumins/node-tree-kill)
- NodeJS package to fix path for MacOS users: [sindresorhus/fix-path](https://github.com/sindresorhus/fix-path)
- MacOS releases: [Stegoo](https://github.com/Stegoo)

## License

Dewep/GCE is licensed under the [GNU General Public License v3.0](LICENSE).

## Future

- Better GIT integration (see+switch branch, parallel calls)
