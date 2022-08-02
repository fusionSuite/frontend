.DEFAULT_GOAL := help

USER = $(shell id -u):$(shell id -g)

ifdef DOCKER
	NG = ./docker/bin/ng
	YARN = ./docker/bin/yarn
else
	NG = ng
	YARN = yarn
endif

.PHONY: start
docker-start: ## Start the development server with Docker
	@echo "Running webserver on http://localhost:4200"
	docker-compose -p fusionsuite-frontend -f docker/docker-compose.yml up

.PHONY: docker-clean
docker-clean: ## Clean the Docker stuff
	docker-compose -p fusionsuite-frontend -f docker/docker-compose.yml down

.PHONY: start
start: ## Start the development server
	$(YARN) start

.PHONY: build
build: ## Build the assets for production
	$(YARN) build

.PHONY: test
test: ## Run the test suite
	$(YARN) test

.PHONY: lint
lint: ## Run the linters on the source code
	$(YARN) eslint --ext js,ts src
	$(YARN) stylelint "src/**/*.{css,scss}"

.PHONY: lint-fix
lint-fix: ## Fix the errors detected by the linters
	$(YARN) eslint --fix --ext js,ts src/
	$(YARN) stylelint --fix "src/**/*.{css,scss}"

.PHONY: install
install: ## Install the dependencies
	$(YARN) install
ifdef DOCKER
	cp src/config.sample.json src/config.json
	sed -i 's#https://backend.example.com#http://localhost:8000#' src/config.json
endif

.PHONY: i18n-extract
i18n-extract: ## Update locale files
	$(NG) extract-i18n --out-file src/locales/messages.xlf
	$(YARN) xliffmerge -p .xliffmerge.json

.PHONY: help
help:
	@grep -h -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-30s\033[0m %s\n", $$1, $$2}'
