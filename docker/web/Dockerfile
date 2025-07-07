FROM node:22-alpine

ARG API_PORT

RUN apk add --no-cache \
  bash \
  mariadb-client

RUN npm install -g pnpm@10.12

WORKDIR /web
