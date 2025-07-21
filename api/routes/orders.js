export default async function (app) {
  const db = app.conn

  app.get("/", async () => {
    const [rows] = await db.query(
      "SELECT \n" +
        "p.*, SUM(pi.preco) as total \n" +
        "FROM Pedidos p \n" +
        "INNER JOIN Pedido_Itens pi ON p.id_pedido = pi.id_pedido \n" +
        "GROUP BY p.id_pedido, p.data, p.id_cliente"
    )
    return rows
  })

  app.get("/:id", async (req, reply) => {
    const [rows] = await db.query("SELECT * FROM Pedidos WHERE id_pedido = ?", [req.params.id])
    if (!rows.length) return reply.code(404).send({ error: "Not found" })
    return rows[0]
  })

  app.post("/", async (req) => {
    const { data, id_cliente } = req.body
    const [result] = await db.query("INSERT INTO Pedidos (data, id_cliente) VALUES (?, ?)", [
      data,
      id_cliente
    ])
    return { id: result.insertId }
  })

  app.put("/:id", async (req, reply) => {
    const { data, id_cliente } = req.body
    const [result] = await db.query(
      "UPDATE Pedidos SET data = ?, id_cliente = ? WHERE id_pedido = ?",
      [data, id_cliente, req.params.id]
    )
    if (result.affectedRows === 0) return reply.code(404).send({ error: "Not found" })
    return { updatad: true }
  })

  app.delete("/:id", async (req, reply) => {
    const [result] = await db.query("DELETE FROM Pedidos WHERE id_pedido = ?", [req.params.id])
    if (result.affectedRows === 0) return reply.code(404).send({ error: "Not found" })
    return { deleted: true }
  })
}
