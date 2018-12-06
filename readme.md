# Tunlr
> ssh tunneling made easy.

Tunlr is all about setting up tunnels to your services running on internal networks via a jumphost using a elegant CLI:

```sh
tunlr $ connect
? Choose a service: (Use arrow keys)
❯ grafana
  mssql-database
```

It uses `autossh` in the background which ensures your connection is kept steady.

## Configuration

Tunlr uses `tunlr.json` to list and connect to your services. Example:

```json
[
    {
        "id": 10000,
        "name": "grafana",
        "host": "tools-server",
        "portLocal": 3002,
        "portRemote": 80
    },
    {
        "id": 20000,
        "name": "mssql-database",
        "host": "database-server",
        "portLocal": 1433,
        "portRemote": 1433
    }
]
```

> Note: The `id` is used internally as monitoring port for `autossh`.

## Running in Docker (Recommended)

Using Docker makes it super easy to get up and running with the CLI. Given the example configuration here above:

```sh
$ docker run --rm -p 1433:1433 -p 3002:3002 -v ~/.ssh/:/root/ssh:ro -it bjerkins/tunlr
```

The internal `ssh` config file includes all config files under `conf.d` at the mounted path. This is convenient as to not mix your local configuration with the internal one.

Example of ssh configuration:

```sh
$ cat ~/.ssh/conf.d/config-aws

Host jumphost
    User username
    HostName the.jumphost.server.address
    IdentityFile ~/.ssh/key.file

Host database-server
    User username
    HostName the.database.server.address
    IdentityFile ~/.ssh/key.file
    ProxyJump jumphost

Host tools-server
    User username
    HostName the.tools.server.address
    IdentityFile ~/.ssh/key.file
    ProxyJump jumphost
```
