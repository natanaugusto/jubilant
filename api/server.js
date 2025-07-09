import fastify from "fastify";
import cors from "@fastify/cors";
import { config } from "dotenv";
import conn from "./conn.js";
import products from "./routes/products.js";
import clients from "./routes/clients.js";
import orders from "./routes/orders.js";

config();

const app = fastify({ logger: true });

app.register(cors, {
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE"]
});
app.register(conn);

const ping = (app) => {
  const db = app.conn;

  app.get("/ping", async (_, reply) => {
    try {
    await app.conn.getConnection();
    app.log.info("Connected to the database");
    reply.status(200).send();
  } catch (err) {
    app.log.error("Database connection failed:", err);
    reply.status(500).send();
  }
  });
}

app.register(async function (app) {
  app.register(ping)
  app.register(products, {prefix: "/products"});
  app.register(clients, {prefix: "/clients"});
  app.register(orders, {prefix: "/orders"});
}, {prefix: "/api"});

const server = async () => {
  const port = process.env.API_PORT || 3000;
  const host = process.env.WEB_HOST || "localhost";
  await app.listen({ port, host });
  app.log.info(`Server is running on http://localhost:${port}`);
}

server().catch(err => {
  app.log.error(err);
  process.exit(1);
});