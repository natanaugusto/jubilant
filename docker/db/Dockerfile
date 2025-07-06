FROM mysql:lts-oraclelinux9

ARG DB_USER
ARG DB_DATABASE
ARG DB_PORT

COPY ./docker/db/my.cnf /etc/mysql/conf.d/my.cnf
COPY ./docker/db/init.sql /docker-entrypoint-initdb.d/init.sql

RUN sed -i "s/#USER/${DB_USER}/g" /docker-entrypoint-initdb.d/init.sql \
  && sed -i "s/#DATABASE/${DB_DATABASE}/g" /docker-entrypoint-initdb.d/init.sql

EXPOSE ${DB_PORT}