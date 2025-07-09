export default async function (app) {
  const db = app.conn

  app.get("/", async () => {
    const [rows] = await db.query("SELECT * FROM Clientes")
    return rows
  })

  app.get("/:id", async (req, reply) => {
    const [rows] = await db.query("SELECT * FROM Clientes WHERE id_cliente = ?", [req.params.id])
    if (!rows.length) return reply.code(404).send({ error: "Not found" })
    return rows[0]
  })

  app.post("/", async (req) => {
    const { nome, email } = req.body
    const [result] = await db.query("INSERT INTO Clientes (nome, email) VALUES (?, ?)", [
      nome,
      email
    ])
    return { id: result.insertId }
  })

  app.put("/:id", async (req, reply) => {
    const { nome, email } = req.body
    const [result] = await db.query(
      "UPDATE Clientes SET nome = ?, email = ? WHERE id_cliente = ?",
      [nome, email, req.params.id]
    )
    if (result.affectedRows === 0) return reply.code(404).send({ error: "Not found" })
    return { updated: true }
  })

  app.delete("/:id", async (req, reply) => {
    const [result] = await db.query("DELETE FROM Clientes WHERE id_cliente = ?", [req.params.id])
    if (result.affectedRows === 0) return reply.code(404).send({ error: "Not found" })
    return { deleted: true }
  })
}
