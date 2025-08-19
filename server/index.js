const express = require("express");
const cors = require("cors");
const supabase = require("./supabaseClient");

const app = express();
app.use(cors());
app.use(express.json());

// Rota para cadastrar livro
app.post("/api/book", async (req, res) => {
  const { title, author, number_of_pages, year_of_publication } = req.body;

  const { data, error } = await supabase
    .from("book")
    .insert([{ title, author, number_of_pages, year_of_publication }]);

  if (error) return res.status(400).json({ error: error.message });
  res.json({ message: "Livro cadastrado com sucesso!", data });
});

const PORT = 3000;
app.listen(PORT, () => console.log(`Servidor rodando em http://localhost:${PORT}`));
