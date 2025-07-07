FROM node:22-alpine

ARG API_PORT

RUN apk add --no-cache \
  bash \
  mariadb-client

RUN npm install -g pnpm

COPY . /app

WORKDIR /app

RUN pnpm install --frozen-lockfile

EXPOSE ${API_PORT}

CMD ["pnpm", "dev"]