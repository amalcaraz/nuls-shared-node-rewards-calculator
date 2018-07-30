.PHONY: build-dev dev test shell down-dev

YML_DEV=environment/dev/docker-compose.yml
COMPOSE_DEV=docker-compose -f ${YML_DEV}

build-dev:
	${COMPOSE_DEV} build

dev: build-dev down-dev
	${COMPOSE_DEV} run --rm --service-ports nuls dev

test: build-dev down-dev
	${COMPOSE_DEV} run --rm --service-ports nuls test

shell: build-dev down-dev
	${COMPOSE_DEV} run --rm nuls /bin/bash

down-dev:
	${COMPOSE_DEV} down