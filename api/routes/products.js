export default async function (app) {
  const db = app.conn

  app.get("/", async () => {
    const [rows] = await db.query("SELECT * FROM Produtos")
    return rows
  })

  app.get("/:id", async (req, reply) => {
    const [rows] = await db.query("SELECT * FROM Produtos WHERE id_produto = ?", [req.params.id])
    if (!rows.length) return reply.code(404).send({ error: "Not found" })
    return rows[0]
  })

  app.post("/", async (req) => {
    const { nome, preco } = req.body
    const [result] = await db.query("INSERT INTO Produtos (nome, preco) VALUES (?, ?)", [
      nome,
      preco
    ])
    return { id: result.insertId }
  })

  app.put("/:id", async (req, reply) => {
    const { nome, preco } = req.body
    const [result] = await db.query(
      "UPDATE Produtos SET nome = ?, preco = ? WHERE id_produto = ?",
      [nome, preco, req.params.id]
    )
    if (result.affectedRows === 0) return reply.code(404).send({ error: "Not found" })
    return { updated: true }
  })

  app.delete("/:id", async (req, reply) => {
    const [result] = await db.query("DELETE FROM Produtos WHERE id_produto = ?", [req.params.id])
    if (result.affectedRows === 0) return reply.code(404).send({ error: "Not found" })
    return { deleted: true }
  })
}
