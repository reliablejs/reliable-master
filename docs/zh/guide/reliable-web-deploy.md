# Web 服务部署

---

注意：运行 reliable 需要启动数据库容器（`reliable-mysql`）和应用容器（`reliable-web`）。

## 使用 [docker-compose](https://docs.docker.com/compose/) (推荐)

### 生产环境

```bash
# start services
$ docker-compose -p reliable -f docker-compose.yml up -d

# NOTE: if you meet the problem, maybe the issue caused by the existed service, just run the stop command below.

# stop services
$ docker-compose -p reliable -f docker-compose.yml down
```

执行 `docker ps` 我们能够看到以下容器：

```
$  docker ps
CONTAINER ID        IMAGE                      COMMAND                  CREATED             STATUS                            PORTS                               NAMES
7c641bdb57c6        macacajs/reliable-web:v2   "./entrypoint.sh npm…"   6 seconds ago       Up 5 seconds (health: starting)   0.0.0.0:9900->9900/tcp              reliable_web_1
f589b1c9046f        macacajs/reliable-mysql    "docker-entrypoint.s…"   6 minutes ago       Up 6 seconds                      0.0.0.0:3306->3306/tcp, 33060/tcp   reliable_mysql_1
```

第一次运行需添加初始数据，否则服务器会返回500错误：

```bash
$ NODE_ENV=production npm run db:seed:all
```

如何进入 MySQL：

```bash
$ docker exec -it reliable_mysql_1 mysql -uroot -preliable
mysql> use reliable;
mysql> show tables;
mysql> select * from reliable.jobNames;
```

### 开发环境

```bash
# start services
$ docker-compose up

# stop services
$ docker-compose down
```

Reliable 服务默认运行在 `http://127.0.0.1:9900`。

Nginx 服务默认运行在 `http://127.0.0.1:9920`，服务的跟路径在
`$HOME/reliable_home/static`，如果不需要也可以去掉这项服务。

需要按需修改 [docker-compose.yml](https://github.com/macacajs/reliable/blob/master/docker-compose.yml) 配置。

## 其他 [Docker](https://docs.docker.com/) 服务部署

### Database container - reliable-mysql

- [Dockerfile](https://github.com/macacajs/reliable/blob/master/docker/reliable-mysql/Dockerfile)
- [doc](https://github.com/macacajs/reliable/blob/master/docker/reliable-mysql/README.md)

### Reliable main app container (backend and frontend) - reliable-web

- [Dockerfile](https://github.com/macacajs/reliable/blob/master/Dockerfile)
- [doc](https://github.com/macacajs/reliable/blob/master/docker/reliable-web/README.md)
