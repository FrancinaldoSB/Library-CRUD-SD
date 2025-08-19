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

// Rota para listar livros
app.get("/api/book", async (req, res) => {
  const { data, error } = await supabase
    .from("book")
    .select("*")
    .order("id", { ascending: false });
  if (error) return res.status(400).json({ error: error.message });
  res.json(data);
});

// Rota para buscar livro por ID
app.get("/api/book/:id", async (req, res) => {
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
app.put("/api/book/:id", async (req, res) => {
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
app.delete("/api/book/:id", async (req, res) => {
  const { id } = req.params;
  const { data, error } = await supabase
    .from("book")
    .delete()
    .eq("id", id);
  if (error) return res.status(400).json({ error: error.message });
  res.json({ message: "Livro deletado com sucesso!", data });
});

// Cadastro
app.post("/api/signup", async (req, res) => {
  const { email, password } = req.body;

  const { data, error } = await supabase.auth.signUp({ email, password });
  if (error) return res.status(400).json({ error: error.message });

  res.json({ message: "Usuário cadastrado com sucesso!", user: data.user });
});

// Login
app.post("/api/login", async (req, res) => {
  const { email, password } = req.body;

  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) return res.status(400).json({ error: error.message });

  res.json({ message: "Login realizado com sucesso!", session: data.session });
});
  
// Logout
app.post("/api/logout", async (req, res) => {
  const { error } = await supabase.auth.signOut();
  if (error) return res.status(400).json({ error: error.message });
  res.json({ message: "Logout realizado!" });
});

const PORT = 3000;
app.listen(PORT, () => console.log(`Servidor rodando em http://localhost:${PORT}`));
