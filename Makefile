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

.PHONY: help
help:
	@grep -h -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-30s\033[0m %s\n", $$1, $$2}'
