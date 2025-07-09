export default async function (app) {
  const db = app.conn

  app.get("/:id/items", async (req) => {
    const [rows] = await db.query("SELECT * FROM Pedido_Itens WHERE id_pedido = ?", [req.params.id])

    return rows
  })

  app.post("/:id/items", async (req, reply) => {
    const id_pedido = req.params.id
    const items = req.body

    // This is not the better way. This is the Brazilian Way
    await db.query("DELETE FROM Pedido_Itens WHERE id_pedido = ?", [id_pedido])
    for (const item of items) {
      const { id_produto, qtde, preco } = item
      await db.query(
        "INSERT INTO Pedido_Itens (id_pedido, id_produto, qtde, preco) VALUES (?, ?, ?, ?)",
        [id_pedido, id_produto, qtde, preco]
      )
    }

    return reply.code(201).send()
  })

  app.delete("/:id/items", async (req, reply) => {
    const [result] = await db.query("DELETE FROM Pedido_Itens WHERE id_pedido = ?", [req.params.id])
    if (result.affectedRows === 0) return reply.code(404).send({ error: "Not found" })
    return { deleted: true }
  })
}
