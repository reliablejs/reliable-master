# reliable-mysql

---

[![docker pull][docker-pull-image]][docker-url]
[![docker pull][docker-size-image]][docker-url]
[![docker pull][docker-layers-image]][docker-url]

[docker-pull-image]: https://img.shields.io/docker/pulls/macacajs/reliable-mysql.svg?style=flat-square&logo=dockbit
[docker-size-image]: https://img.shields.io/microbadger/image-size/macacajs/reliable-mysql.svg?style=flat-square&logo=dockbit
[docker-layers-image]: https://img.shields.io/microbadger/layers/macacajs/reliable-mysql.svg?style=flat-square&logo=dockbit
[docker-url]: https://hub.docker.com/r/macacajs/reliable-mysql/

## production

```bash
$ docker run --name reliable-mysql \
  -v $HOME/reliable_home/mysql_data:/var/lib/mysql \
  -p 3306:3306 \
  -d macacajs/reliable-mysql
```

---

Just for developer

## build image

```bash
$ cd docker/reliable-mysql
$ docker build --pull -t macacajs/reliable-mysql .
$ docker push macacajs/reliable-mysql
```

## development

```bash
# start
$ docker run --rm --name reliable-mysql \
  -p 3306:3306 \
  -v $HOME/reliable_home/mysql_data:/var/lib/mysql \
  macacajs/reliable-mysql

# stop
$ docker stop reliable-mysql
```
