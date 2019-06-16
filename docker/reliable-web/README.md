# reliable-web

---

[![docker pull][docker-pull-image]][docker-url]
[![docker pull][docker-size-image]][docker-url]
[![docker pull][docker-layers-image]][docker-url]

[docker-pull-image]: https://img.shields.io/docker/pulls/macacajs/reliable-web.svg?style=flat-square&logo=dockbit
[docker-size-image]: https://img.shields.io/microbadger/image-size/macacajs/reliable-web.svg?style=flat-square&logo=dockbit
[docker-layers-image]: https://img.shields.io/microbadger/layers/macacajs/reliable-web.svg?style=flat-square&logo=dockbit
[docker-url]: https://hub.docker.com/r/macacajs/reliable-web/

## production

Note: launch `reliable-mysql` service and seed data via `npm run db:seed:all` first.

If you don't seed data the server will return 500 error.

[available environment variable](./#environment-variable)

```bash
$ docker run --rm --name reliable-web \
  -p 9900:9900 \
  -e RELIABLE_HOST=127.0.0.1 \
  -e MYSQL_HOST=reliable-mysql \
  --link reliable-mysql:reliable-mysql \
  macacajs/reliable-web:v2
```

run as a service

```bash
$ docker run --name reliable-web \
  -p 9900:9900 \
  -e RELIABLE_HOST=127.0.0.1 \
  -e MYSQL_HOST=reliable-mysql \
  --link reliable-mysql:mysql-host \
  -d macacajs/reliable-web:v2
```

open http://127.0.0.1:9900

if you want another hostname, please replace the `127.0.0.1`

---

Just for developer

## build image

```bash
$ cd ${PROJECT_ROOT_PATH}
$ docker build --no-cache --pull -t macacajs/reliable-web .
$ docker push macacajs/reliable-web
```

## development

start mysql:

```bash
# start
$ docker run --rm --name reliable-mysql \
  -p 3306:3306 \
  -v $HOME/reliable_home/mysql_data:/var/lib/mysql \
  -d macacajs/reliable-mysql

# stop
$ docker stop reliable-mysql
```

start server:

```bash
npm run dev
# open app at localhost:7001
```

insert seed data:

```bash
npm run db:seed:all
```

remove seed data:

```bash
npm run db:seed:undo:all
```

## test

```bash
npm test  # test migration then test web server
npm run test-local  # only test web server
npm run cov  # test and output test coverage
```

## environment-variable

variable name             | description                                   | default value
---                       | ---                                           | ---
MYSQL_HOST                | mysql server ip                               | 127.0.0.1
MYSQL_PORT                | mysql port                                    | 3306
RELIABLE_HOST               | used for notification message template        | 127.0.0.1
