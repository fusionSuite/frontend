.DEFAULT_GOAL := help

.PHONY: start
start: ## Start the development server
	yarn start

.PHONY: build
build: ## Build the assets for production
	yarn build

.PHONY: test
test: ## Run the test suite
	yarn test

.PHONY: lint
lint: ## Run the linters on the source code
	yarn eslint --ext js,ts src
	yarn stylelint "**/*.{css,scss}"

.PHONY: lint-fix
lint-fix: ## Fix the errors detected by the linters
	yarn eslint --fix --ext js,ts src/
	yarn stylelint --fix "**/*.{css,scss}"

.PHONY: install
install: ## Install the dependencies
ifndef BACKEND_URL
	$(error You need to provide a "BACKEND_URL" argument)
endif
	@echo 'Install yarn dependencies.'
	@yarn install
	@echo 'Setup the initial config file (from sample).'
	@cp src/config.sample.json src/config.json
	@echo 'Set the correct backend URL in the config file.'
	@sed -i 's#https://backend.example.com#$(BACKEND_URL)#' src/config.json
	@echo 'All good! You can edit the backend URL in the src/config.json file if you need.'

.PHONY: help
help:
	@grep -h -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-30s\033[0m %s\n", $$1, $$2}'
