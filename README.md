# GCE

## Global Commands Execution

Desktop application to run regular scripts (webpack dev, server, vagrant, etc.). [Download the latest release.](https://github.com/Dewep/GCE/releases/latest)

![Preview](assets/preview.png)

The list of commands must be in your "home" folder (`C:/Users/XXXX/` or `/home/XXXX/`), in a configuration file named `gce.yml`.

## Configuration file

```yml
---
# GCE https://github.com/Dewep/GCE

root: C:\Users\Dewep\Documents\projects

commands:
  - name: Vagrant WorkSpace
    cmd: vagrant up
    stop-cmd: vagrant halt

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
- `cmd`: Command to exec
- `stop-cmd` _(optional)_: If defined, allows to have a command to execute when stopping the service. This is useful for commands such as Vagrant: `cmd` is used to start the VM (`vagrant up`), `stop-cmd` to stop it (`vagrant halt`).

## Todo

- Ctrl+L to clear output
- Ctrl+C to stop
- Build release for linux
