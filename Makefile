current_version = $$(git branch 2>/dev/null | sed -e '/^[^*]/d' -e 's/* \(.*\)/\1/')
npm_bin = $$(npm bin)

port = 3333
server_cmd = ./bin/reliable-master server -p ${port} -w 1 --verbose

help:
	@echo ""
	@echo "make server                 Serve for the specified environment"
	@echo "make build                  Build static resource"
	@echo "make lint                   Run eslint"
	@echo "make watch                  Watch and build static resource"
	@echo "make flush                  Clear logs"
	@echo "make dump                   Export data from mongo container in specified environment to ~/reliable_dev.tar"
	@echo "make restore                Import data from ~/reliable_dev.tar to mongo container in specified environment"

clean:
	@rm -rf ./node_modules ./temp ./logs nohup.out
server:
	$(server_cmd)
dump:
	./scripts/mongo-dump.sh reliable ~/reliable.tar
restore:
	./scripts/mongo-restore.sh ~/reliable.tar reliable
build: install
	@${npm_bin}/webpack
lint:
	@${npm_bin}/eslint .
watch:
	@${npm_bin}/webpack --watch
flush:
	find ./logs -type f -and -name '*.log' | xargs rm
adduser:
	./bin/reliable-master adduser
install:
	@npm install --registry=https://registry.npm.taobao.org
build-docker:
	docker build -t="reliable-master" .
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
.PHONY: test
