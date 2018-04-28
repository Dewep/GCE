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

root: C:\Users\Dewep\Documents\projects

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

extra-groups:
  windows: shell explorer
  git: git-pull git-gui
  node: npm

extra-default: windows git node

commands:
  - name: Vagrant WorkSpace
    cmd: vagrant up
    stop-cmd: vagrant halt
    extra: windows

  - name: Watch-Later/Server
    path: Watch-Later
    cmd: npm start
  - name: Watch-Later/Brunch watch
    path: Watch-Later
    cmd: npm run watch-app
```

__commands[]__:

- `name`: Name of the command. Possibility to group the command in sections, by adding the section name followed by a `/` before the name (`Section name/Command name`).
- `path` _(optional)_: Directory path to run the command. This is append to the `root` configuration path.
- `cmd`: Command to exec.
- `stop-cmd` _(optional)_: If defined, allows to have a command to execute when stopping the service. This is useful for commands such as Vagrant: `cmd` is used to start the VM (`vagrant up`), `stop-cmd` to stop it (`vagrant halt`).
- `extra` _(optional, default to `extra-default`)_: Array of extra (or extra-groups) commands (present in the status-bar).

__extra[]__:

- `name`: Name of the extra command.
- `cmd`: Command to exec.
- `detached`: Launch as detached/external script (explorer, shell, etc.). You can use `%dir%` to have the current directory in the command.

__extra-groups[]__:

Dictionnary to set groups of extras.

## Build

```bash
$> git clone git@github.com:Dewep/GCE.git
$> cd GCE
$> npm install
$> npm run dist
```

## Credits

- Colors (Tomorrow night): https://github.com/chriskempson/tomorrow-theme#tomorrow-night
- Font family (Ubuntu font): https://design.ubuntu.com/font/
- Icon made by [Smashicons](https://www.flaticon.com/authors/smashicons) from [www.flaticon.com](https://www.flaticon.com): https://www.flaticon.com/free-icon/chip_141007

- Desktop webapp: https://electronjs.org
- NodeJS package to parse yaml: https://github.com/nodeca/js-yaml
- NodeJS package to kill trees of processes: https://github.com/pkrumins/node-tree-kill

## License

Dewep/GCE is licensed under the [GNU General Public License v3.0](LICENSE).

## Future

- Better GIT integration (see+switch branch, parallel calls)
