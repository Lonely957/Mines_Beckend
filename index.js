const express = require("express");
const cors = require("cors");
const app = express();
const router = require("./Routes/routes");

app.use(cors());
app.use(express.json());

app.use((req, res, next) => {
  console.log(`Recebendo requisição: ${req.method} ${req.url}`);
  next();
});

app.use(router);

app.get("/", (req, res) => {
  res.send("API está funcionando!");
});

app.listen(3000, () => {
  console.log("Servidor rodando na porta 3000");
});


// Imprime as requisições recebidas
app.use((req, res, next) => {
  console.log(`Recebendo requisição: ${req.method} ${req.url}`);
  next();
});
