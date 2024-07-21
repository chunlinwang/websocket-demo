CORE_SERVICES := app
ALL_SERVICES := ${CORE_SERVICES}

DOCKER_COMPOSE_FILE := -f docker-compose.yml

# --------------------------

help: ## Show this help.
	@fgrep -h "##" $(MAKEFILE_LIST) | fgrep -v fgrep | sed -e 's/\\$$//' | sed -e 's/##//'

build: down ## build docker container
	@docker-compose ${DOCKER_COMPOSE_FILE} build ${ALL_SERVICES}

up: down ## up docker container
	@docker-compose ${DOCKER_COMPOSE_FILE} up -d ${ALL_SERVICES}

down: ## down docker container
	@docker-compose ${DOCKER_COMPOSE_FILE} down

stop: ## stop docker container
	@docker-compose ${DOCKER_COMPOSE_FILE} stop ${ALL_SERVICES}

restart: ## restart docker container
	@docker-compose ${DOCKER_COMPOSE_FILE} restart ${ALL_SERVICES}

rm: ## rm docker container
	@docker-compose $(DOCKER_COMPOSE_FILE) rm -f ${ALL_SERVICES}

logs: ## show docker container logs
	@docker-compose $(DOCKER_COMPOSE_FILE) logs --follow --tail=1000 ${ALL_SERVICES}

images: ## show docker images
	@docker-compose $(DOCKER_COMPOSE_FILE) images ${ALL_SERVICES}

clean: ## Remove all Containers and Delete Volume Data
	@docker-compose ${DOCKER_COMPOSE_FILE} down -v

cli: ## connect to the docker container
	@docker-compose ${DOCKER_COMPOSE_FILE} exec -it app bash

lint: ## Launch eslint
	@docker-compose ${DOCKER_COMPOSE_FILE} exec -T app sh -c "pnpm lint"

format: ## Launch prettier
	@docker-compose ${DOCKER_COMPOSE_FILE} exec -T app sh -c "pnpm format"

test: ## Launch test
	@docker-compose ${DOCKER_COMPOSE_FILE} exec -T app sh -c "pnpm test"

test-cov: ## Launch test with coverage
	@docker-compose ${DOCKER_COMPOSE_FILE} exec -T app sh -c "pnpm test:cov"