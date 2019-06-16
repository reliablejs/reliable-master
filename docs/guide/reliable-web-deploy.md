# Reliable Web Deploy

---

Note: You need to run both the database container (`reliable-mysql`) and the app (`reliable-web`) container for reliable to work.

## Using [docker-compose](https://docs.docker.com/compose/) (recommended)

### production

```
# start services
$ docker-compose -p reliable -f docker-compose.yml up -d

# NOTE: if you meet the problem, maybe the issue caused by the existed service, just run the stop command below.

# stop services
$ docker-compose -p reliable -f docker-compose.yml down
```

Execute `docker ps`, we can see:

```
$ docker ps
CONTAINER ID        IMAGE                         COMMAND                  CREATED             STATUS                   PORTS                               NAMES
d42a6be2a061        macacajs/reliable-web:test3   "./entrypoint.sh npm…"   3 minutes ago       Up 3 minutes (healthy)   0.0.0.0:9900->9900/tcp              reliable-web
4d7d43591802        macacajs/reliable-mysql       "docker-entrypoint.s…"   20 minutes ago      Up 20 minutes            0.0.0.0:3306->3306/tcp, 33060/tcp   reliable-mysql
```

During the first deployment, seed the database before accessing the web portal. Otherwise 500 will be thrown:

```bash
$ NODE_ENV=production npm run db:seed:all
```

To go into the MySQL:

```bash
$ docker exec -it reliable_mysql_1 mysql -uroot -preliable
mysql> use reliable;
mysql> show tables;
mysql> select * from reliable.jobNames;
```

### development

```
# start services
$ docker-compose up

# stop services
$ docker-compose down
```

Reliable server is running on `http://127.0.0.1:9900` by default.

Edit [docker-compose.yml](https://github.com/macacajs/reliable/blob/master/docker-compose.yml) to fit your need.

## Using [docker](https://docs.docker.com/)

### Database container - reliable-mysql

- [Dockerfile](https://github.com/macacajs/reliable/blob/master/docker/reliable-mysql/Dockerfile)
- [doc](https://github.com/macacajs/reliable/blob/master/docker/reliable-mysql/README.md)

### Reliable main app container (backend and frontend) - reliable-web
- [Dockerfile](https://github.com/macacajs/reliable/blob/master/Dockerfile)
- [doc](https://github.com/macacajs/reliable/blob/master/docker/reliable-web/README.md)

