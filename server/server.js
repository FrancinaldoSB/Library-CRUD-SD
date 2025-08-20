const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/auth");
const bookRoutes = require("./routes/book");

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api", bookRoutes);

app.use("/api", authRoutes);

app.get("/", (req, res) => {
  res.send("Tá rodando??? YES");
})

const PORT = 3000;
app.listen(PORT, () => console.log(`Servidor rodando em http://localhost:${PORT}`));
