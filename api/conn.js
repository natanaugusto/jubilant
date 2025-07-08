import fp from "fastify-plugin"
import mysql from "mysql2/promise";

export default fp(async (fastify) => {
  fastify.decorate('conn', await mysql.createPool({
    host: process.env.DB_HOST || "db",
    port: process.env.DB_PORT || 3306,
    user: process.env.DB_USER || "user",
    password: process.env.DB_PASSWORD || "password",
    database: process.env.DB_DATABASE || "database"
  }));
});