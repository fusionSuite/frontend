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
	yarn install

.PHONY: i18n-extract
i18n-extract: ## Update locale files
	ng extract-i18n --out-file src/locales/messages.xlf
	yarn xliffmerge -p .xliffmerge.json

.PHONY: help
help:
	@grep -h -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-30s\033[0m %s\n", $$1, $$2}'
