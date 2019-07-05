# reliable-nginx

---

[![docker pull][docker-pull-image]][docker-url]
[![docker pull][docker-size-image]][docker-url]
[![docker pull][docker-layers-image]][docker-url]

[docker-pull-image]: https://img.shields.io/docker/pulls/macacajs/reliable-nginx.svg?style=flat-square&logo=dockbit
[docker-size-image]: https://img.shields.io/microbadger/image-size/macacajs/reliable-nginx.svg?style=flat-square&logo=dockbit
[docker-layers-image]: https://img.shields.io/microbadger/layers/macacajs/reliable-nginx.svg?style=flat-square&logo=dockbit
[docker-url]: https://hub.docker.com/r/macacajs/reliable-nginx/

## production

```bash
$ docker run --name reliable-nginx \
  -p 9920:80 \
  -v $HOME/reliable_home/static:/usr/share/nginx/html:ro \
  -d macacajs/reliable-nginx
```

---

Just for developer

## build image

```bash
$ cd docker/reliable-nginx
$ docker build --pull -t macacajs/reliable-nginx .
$ docker push macacajs/reliable-nginx
```
