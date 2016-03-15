# Deploy

## General Requirements

- [git](http://git-scm.com/) >= 2.0
- [docker](https://www.docker.com/) >= 1.9.1
- [docker compose](https://www.docker.com/products/docker-compose) >= 1.5.2

> Note: some requirements, like nodejs, mongodb, redis, can use docker to pull and run. With docker, you don't need to care.

## Basic Usage

Get the source code, then you can use docker and docker-compose to setup `reliable`, just like:

```shell
git clone https://github.com/reliablejs/reliable-master.git
cd reliable
make deploy
```

If you want to run in production, run `make deploy env=prod` instead, default is `env=dev`.

## Configuring

`relibale` default configuration is in [config.js](../../common/config.js), you could override it by add config file in root directory which need named `*.reliable.config.js`.

There is the relevant description:

> It's a good idea not to change configuration of MongoDB & Redis, because docker-compose will take care of them. If you need to change, please update [docker-compose.yml](docker-compose.yml) to satisfy.

- server
  Settings for Http server, like port.
- site
  Some preferences for your site, like title, baseurl, and so on.
- auth
  Third part token configuration, like [Github](http://github.com/), [Gitlab](https://gitlab.com).

- mail
  Mail service configuration, see [Nodemailer](https://github.com/nodemailer/nodemailer).

## Advanced Topics

### Make Commands

We use [Makefile](Makefile) to provide some commands to make daily work. See simple introducion by `make help`.

> Notice, acquiescently `reliable` provides two mode to run, prod or dev (default), and you should assign mode when make, just link `make status env=prod`.

### Add Administrator

Using `make adduser` in root directory to add administrator for initialization.

### Running status

Using `make status` in root directory to get docker containers' running status.

### Logging

Using `make logs` in source folder to get containers running logs, which is about MongoDB, Redis, and connection status of slaves.

### Data Backup

Using `make dump` to dump data from MongoDB containers, data package will be in `~/reliable.tar`.

Using `make restore` to restore data into MongoDB containers from `~/reliable.tar`.

You can use `crontab` to backup data. See [scripts/cron.sh](scripts/cron.sh), edit it for customization, and add it to your crontab script. Like:

```
crontab -e
```

Configuration:

- home - System user home path where you put repo.
- repo - Path of `reliable` source code folder.
- url - Url to get slaves info, `http://<hostname>:<port>/slaves`, like `http://localhost:3333/slaves`
- slave_path - Path of data backup in your slaves, default is `~/data_backup`
