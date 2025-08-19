const express = require("express");
const supabase = require("../supabaseClient");

const router = express.Router();

// Rota para cadastrar livro
router.post("/book", async (req, res) => {
  const { title, author, number_of_pages, year_of_publication } = req.body;

  const { data, error } = await supabase
    .from("book")
    .insert([{ title, author, number_of_pages, year_of_publication }]);

  if (error) return res.status(400).json({ error: error.message });
  res.json({ message: "Livro cadastrado com sucesso!", data });
});

// Rota para listar livros
router.get("/book", async (req, res) => {
  const { data, error } = await supabase
    .from("book")
    .select("*")
    .order("id", { ascending: false });
  if (error) return res.status(400).json({ error: error.message });
  res.json(data);
});

// Rota para buscar livro por ID
router.get("/book/:id", async (req, res) => {
  const { id } = req.params;
  const { data, error } = await supabase
    .from("book")
    .select("*")
    .eq("id", id)
    .single();
  if (error) return res.status(400).json({ error: error.message });
  res.json(data);
});

// Rota para atualizar livro
router.put("/book/:id", async (req, res) => {
  const { id } = req.params;
  const { title, author, number_of_pages, year_of_publication } = req.body
  const { data, error } = await supabase
    .from("book")
    .update({ title, author, number_of_pages, year_of_publication })
    .eq("id", id);
  if (error) return res.status(400).json({ error: error.message });
  res.json({ message: "Livro atualizado com sucesso!", data });
});

// Rota para deletar livro
router.delete("/book/:id", async (req, res) => {
  const { id } = req.params;
  const { data, error } = await supabase
    .from("book")
    .delete()
    .eq("id", id);
  if (error) return res.status(400).json({ error: error.message });
  res.json({ message: "Livro deletado com sucesso!", data });
});

module.exports = router;
