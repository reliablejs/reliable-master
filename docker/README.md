# Dockerfiles

---

You need to run both `database` and `app` containers

## Running both together with docker-compose

```bash
# cd to project root where docker-compose.yml is located
$ docker-compose up
```

```bash
# add seed to db, otherwise 500 will be thrown
$ NODE_ENV=production npm run db:seed:all
```

## Starting them separately

### Database container - reliable-mysql

- [Dockerfile](https://github.com/macacajs/reliable/blob/master/docker/reliable-mysql/Dockerfile)
- [doc](https://github.com/macacajs/reliable/blob/master/docker/reliable-mysql/README.md)

### Reliable main app container (backend and frontend) - reliable-web
- [Dockerfile](https://github.com/macacajs/reliable/blob/master/Dockerfile)
- [doc](https://github.com/macacajs/reliable/blob/master/docker/reliable-web/README.md)
