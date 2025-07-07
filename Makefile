ifneq (,$(wildcard ./.env))
	include .env
	export
endif

SHELL := /bin/bash

DB_HOST ?= db
DB_PORT ?= 3306
DB_DATABASE ?= database
DB_USER ?= user
DB_PASSWORD ?= secret
DB_ROOT_PASSWORD ?= root

COMPOSE_FILE = docker-compose.yaml
EXEC_CMD = docker compose -f $(COMPOSE_FILE) exec web bash -c

RED = \033[0;31m
GREEN = \033[0;32m
YELLOW = \033[1;33m
BLUE = \033[0;34m
NC = \033[0m # No Color

.DEFAULT_GOAL := help

help:
	@echo -e "$(BLUE)Available Commands:$(NC)"
	@echo -e ""
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?## "}; {printf "  $(GREEN)%-15s$(NC) %s\n", $$1, $$2}'
	@echo -e ""

up: ## Start all containers
	@echo -e "$(BLUE)Starting Docker containers...$(NC)"; \
	docker compose -f $(COMPOSE_FILE) up -d && \
	$(EXEC_CMD) "pnpm i --frozen-lockfile" \
	@echo -e "$(GREEN)Containers started successfully!$(NC)"

down: ## Stop all containers
	@echo -e "$(BLUE)Stopping Docker containers...$(NC)"; \
	docker compose -f $(COMPOSE_FILE) down
	@echo -e "$(GREEN)Containers stopped successfully!$(NC)"

restart: down up ## Restart all containers

build: ## Build Docker images
	@echo -e "$(BLUE)Building Docker images...$(NC)"
	docker compose -f $(COMPOSE_FILE) build --no-cache
	@echo -e "$(GREEN)Images built successfully!$(NC)"

clean: ## Clean up containers, volumes, and images
	@echo -e "$(BLUE)Cleaning up Docker resources...$(NC)"
	docker compose -f $(COMPOSE_FILE) down -v --rmi all
	@echo -e "$(GREEN)Cleanup completed!$(NC)"

status: ## Show container status
	@echo -e "$(BLUE)Container status:$(NC)"
	docker compose -f $(COMPOSE_FILE) ps

db: ## Access the database container
	@echo -e "$(BLUE)Accessing the database container...$(NC)"
	docker compose -f $(COMPOSE_FILE) exec $(DB_HOST) mysql -u$(DB_USER) -p$(DB_PASSWORD) $(DB_DATABASE) -P $(DB_PORT)

pnpm: ## Run pnpm commands in the web container
	@$(EXEC_CMD) "pnpm $(wordlist 2,$(words $(MAKECMDGOALS)),$(MAKECMDGOALS))"

api\:dev: ## Start the API server in development mode
	@echo -e "$(BLUE)Starting API server in development mode...$(NC)"
	$(EXEC_CMD) "pnpm run api:dev"

app\:dev: ## Start the Web App server in development mode
	@echo -e "$(BLUE)Starting Web App server in development mode...$(NC)"
	$(EXEC_CMD) "pnpm run app:dev"

dev: ## Start the Web App and API servers in develop mode
	@echo -e "$(BLUE)Starting Web App and API servers in development mode...$(NC)"
	$(EXEC_CMD) "pnpm run dev"

%:
	@: