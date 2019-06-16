# Reliable Web Deploy

---

## Docker Deploy

### Using [docker-compose](https://docs.docker.com/compose/) (recommended)

## production

```
# start services
$ docker-compose -p reliable -f docker-compose.yml up -d

# NOTE: if you meet the problem, maybe the issue caused by the existed service, just run the stop command below.

# stop services
$ docker-compose -p reliable -f docker-compose.yml down
```

execute `docker ps`, we can see:

```
CONTAINER ID        IMAGE                     COMMAND                  CREATED             STATUS                      PORTS                                            NAMES
8b2941c9774a        macacajs/reliable-web       "./entrypoint.sh npm…"   12 minutes ago      Up 12 minutes (healthy)     0.0.0.0:9900->9900/tcp                           reliable_web_1
b726a3232cdc        macacajs/reliable-mysql     "docker-entrypoint.s…"   12 minutes ago      Up 12 minutes               3306/tcp                                         reliable_mysql_1
ffb2ab9f12fb        macacajs/reliable-nginx     "nginx -g 'daemon of…"   12 minutes ago      Up 12 minutes               0.0.0.0:9920->80/tcp                             reliable_nginx_1
```

go into the MySQL

```bash
$ docker exec -it reliable_mysql_1 mysql -uroot -preliable
mysql> use reliable;
mysql> show tables;
mysql> select * from reliable.jobNames;
```

## development

```
# start services
$ docker-compose up

# stop services
$ docker-compose down
```

Reliable server is running on `http://127.0.0.1:9900` by default.

Nginx server is running on `http://127.0.0.1:9920` by default.

Edit [docker-compose.yml](https://github.com/macacajs/reliable/blob/master/docker-compose.yml) to fit your need.

### Using [docker](https://docs.docker.com/)

- [reliable-web](../../docker/reliable-web/README.md)
- [reliable-mysql](../../docker/reliable-mysql/README.md)
