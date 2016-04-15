current_version = $$(git branch 2>/dev/null | sed -e '/^[^*]/d' -e 's/* \(.*\)/\1/')
npm_bin = $$(npm bin)

# environment config, dev or prod
env = dev

ifeq ($(env),prod)
port = 8080
server_cmd = ./bin/reliable-master server -p ${port}
endif

ifeq ($(env),dev)
port = 3333
server_cmd = ./bin/reliable-master server -p ${port} -w 1 --verbose
endif

help:
	@echo ""
	@echo "make serve env=             Serve for the specified environment"
	@echo "make deploy env=            Build and run with docker"
	@echo "make logs env=              View running logs in docker"
	@echo "make status env=            Check docker status"
	@echo "make stop env=              Stop running containers"
	@echo "make start env=             Start containers to serve"
	@echo "make restart env=           Restart relevant containers"
	@echo "make build                  Build static resource"
	@echo "make lint                   Run eslint"
	@echo "make watch                  Watch and build static resource"
	@echo "make flush                  Clear logs"
	@echo "make dump env=              Export data from mongo container in specified environment to ~/reliable_dev.tar"
	@echo "make restore env=           Import data from ~/reliable_dev.tar to mongo container in specified environment"
	@echo "make adduser env=           Add admin user to reliable"
	@echo ""
	@echo "env for specifying environment, can be 'dev' or 'prod', default value is 'dev'."

clean:
	@rm -rf ./node_modules ./temp ./logs nohup.out
logs:
	RELIABLE_ENV_PORT=${port} RELIABLE_ENV_CONFIG=${env} docker-compose logs
status:
	RELIABLE_ENV_PORT=${port} RELIABLE_ENV_CONFIG=${env} docker-compose ps
serve:
	$(server_cmd)
deploy: stop
	RELIABLE_ENV_PORT=${port} RELIABLE_ENV_CONFIG=${env} docker-compose build
	RELIABLE_ENV_PORT=${port} RELIABLE_ENV_CONFIG=${env} docker-compose up -d
start:
	RELIABLE_ENV_PORT=${port} RELIABLE_ENV_CONFIG=${env} docker-compose start
stop:
	RELIABLE_ENV_PORT=${port} RELIABLE_ENV_CONFIG=${env} docker-compose kill
restart: stop start
dump:
	RELIABLE_ENV_CONFIG=${env} ./scripts/mongo-dump.sh reliable ~/reliable.tar
restore:
	RELIABLE_ENV_CONFIG=${env} ./scripts/mongo-restore.sh ~/reliable.tar reliable
build:
	@${npm_bin}/webpack
lint:
	@${npm_bin}/eslint .
watch:
	@${npm_bin}/webpack --watch
flush:
	find ./logs -type f -and -name '*.log' | xargs rm
adduser:
	docker exec -it reliable_master_${env} /reliable-master/bin/reliable-master adduser
install:
	@npm install
test: install
	@node --harmony \
		${npm_bin}/istanbul cover ${npm_bin}/_mocha \
		-- \
		--timeout 10000 \
		--require co-mocha
travis: install
	@NODE_ENV=test $(BIN) $(FLAGS) \
		./node_modules/.bin/istanbul cover \
		./node_modules/.bin/_mocha \
		--report lcovonly \
		-- -u exports \
		$(REQUIRED) \
		$(TESTS) \
		--bail
.PHONY: test logs
