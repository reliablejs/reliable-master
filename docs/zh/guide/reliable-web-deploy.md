# Web 服务部署

---

## Docker 部署

### 使用 [docker-compose](https://docs.docker.com/compose/) (推荐)

## 生产环境

```bash
# start services
$ docker-compose -p reliable -f docker-compose.yml up -d

# NOTE: if you meet the problem, maybe the issue caused by the existed service, just run the stop command below.

# stop services
$ docker-compose -p reliable -f docker-compose.yml down
```

执行 `docker ps` 我们能够看到以下容器：

```
CONTAINER ID        IMAGE                     COMMAND                  CREATED             STATUS                      PORTS                                            NAMES
8b2941c9774a        macacajs/reliable-web       "./entrypoint.sh npm…"   12 minutes ago      Up 12 minutes (healthy)     0.0.0.0:9900->9900/tcp                           reliable_web_1
b726a3232cdc        macacajs/reliable-mysql     "docker-entrypoint.s…"   12 minutes ago      Up 12 minutes               3306/tcp                                         reliable_mysql_1
ffb2ab9f12fb        macacajs/reliable-nginx     "nginx -g 'daemon of…"   12 minutes ago      Up 12 minutes               0.0.0.0:9920->80/tcp                             reliable_nginx_1
```

进入 MySQL

```bash
$ docker exec -it reliable_mysql_1 mysql -uroot -preliable
mysql> use reliable;
mysql> show tables;
mysql> select * from reliable.jobNames;
```

## 开发环境

```bash
# start services
$ docker-compose up

# stop services
$ docker-compose down
```

Reliable 服务默认运行在 `http://127.0.0.1:9900`。

Nginx 服务默认运行在 `http://127.0.0.1:9920`。

需要按需修改 [docker-compose.yml](https://github.com/macacajs/reliable/blob/master/docker-compose.yml) 配置。

### 其他 [Docker](https://docs.docker.com/) 服务部署

- [reliable-web](../../docker/reliable-web/README.md)
- [reliable-mysql](../../docker/reliable-mysql/README.md)
