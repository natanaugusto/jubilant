import fastify from "fastify";
import mysql from "mysql2/promise";
import { config } from "dotenv";

config();

const app = fastify({ logger: true });

const conn = mysql.createPool({
  host: process.env.DB_HOST || "db",
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER || "user",
  password: process.env.DB_PASSWORD || "password",
  database: process.env.DB_DATABASE || "database"
});

app.get("/ping", async (_, reply) => {
  reply.status(200).send();
});

const server = async () => {
  try {
    await conn.getConnection();
    app.log.info("Connected to the database");
  } catch (err) {
    app.log.error("Database connection failed:", err);
    process.exit(1);
  }

  const port = process.env.API_PORT || 3000;
  const host = process.env.WEB_HOST || "localhost";
  await app.listen({ port, host });
  app.log.info(`Server is running on http://localhost:${port}`);
}

server().catch(err => {
  app.log.error(err);
  process.exit(1);
});