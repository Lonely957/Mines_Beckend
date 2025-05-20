// screen/routes.js
const express = require("express");
const router = express.Router(); 
const pool = require("../db"); // ajusta se o caminho for diferente
const bcrypt = require("bcrypt");
const crypto = require("crypto");



// Rota para criar um novo usuário
router.post("/usuarios", async (req, res) => {
  const { username, email, senha } = req.body;

  try {
    const senhaCriptografada = await bcrypt.hash(senha, 10);

    await pool.query(
      "INSERT INTO usuarios (username, email, senha) VALUES ($1, $2, $3)",
      [username, email, senhaCriptografada]
    );

    res.status(201).json({ message: "Usuário criado com sucesso!" }); // <- JSON aqui
  } catch (err) {
    console.error("Erro ao criar usuário:", err);
    res.status(500).json({ error: "Erro ao criar usuário" }); // <- JSON aqui também
  }
});

// Rota para solicitar recuperação de senha
router.post("/recuperar-senha", async (req, res) => {
  const { email } = req.body;

  console.log(`Consultando e-mail: ${email}`); // Log para verificar o e-mail

  try {
    // Verifique se a consulta SQL foi bem-sucedida
    const result = await pool.query("SELECT * FROM usuarios WHERE email = $1", [email]);

    console.log("Resultado da consulta:", result.rows);  // Log para verificar os dados retornados do banco

    if (result.rows.length === 0) {
      console.log("Usuário não encontrado");
      return res.status(404).json({ error: "Usuário não encontrado com esse e-mail" });
    }

    // Gerar token
    const token = crypto.randomBytes(3).toString("hex");
    const expira = new Date(Date.now() + 15 * 60 * 1000);  // Expiração do token

    console.log(`Gerando token para o e-mail ${email}: ${token}`);
    
    // Atualizar banco de dados com o token
    await pool.query(
      "UPDATE usuarios SET token_recuperacao = $1, token_expira_em = $2 WHERE email = $3",
      [token, expira, email]
    );

    console.log(`Código de recuperação para ${email}: ${token}`);

    // Resposta para o frontend
    res.json({ message: "Código de recuperação enviado para o e-mail." });

  } catch (err) {
    console.error("Erro ao gerar token de recuperação:", err);
    res.status(500).json({ error: "Erro interno ao processar recuperação" });
  }
});


// Rota para redefinir senha com token
router.post("/redefinir-senha", async (req, res) => {
  const { email, token, novaSenha } = req.body;

  try {
    const result = await pool.query(
      "SELECT * FROM usuarios WHERE email = $1 AND token_recuperacao = $2",
      [email, token]
    );

    if (result.rows.length === 0) {
      return res.status(400).json({ error: "Token inválido ou e-mail incorreto" });
    }

    const usuario = result.rows[0];
    const agora = new Date();

    if (usuario.token_expira_em < agora) {
      return res.status(400).json({ error: "Token expirado. Solicite um novo." });
    }

    const novaSenhaCriptografada = await bcrypt.hash(novaSenha, 10);

    await pool.query(
      "UPDATE usuarios SET senha = $1, token_recuperacao = NULL, token_expira_em = NULL WHERE email = $2",
      [novaSenhaCriptografada, email]
    );

    res.json({ message: "Senha redefinida com sucesso!" });
  } catch (err) {
    console.error("Erro ao redefinir senha:", err);
    res.status(500).json({ error: "Erro interno ao redefinir senha" });
  }
});



// Rota de login
router.post("/login", async (req, res) => {
  const { email, senha } = req.body;

  try {
    const result = await pool.query("SELECT * FROM usuarios WHERE email = $1", [email]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Usuário não encontrado" });
    }

    const usuario = result.rows[0];
    const senhaCorreta = await bcrypt.compare(senha, usuario.senha);

    if (!senhaCorreta) {
      return res.status(401).json({ error: "Senha incorreta" });
    }

    res.json({ message: "Login realizado com sucesso!", usuario });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao realizar login" });
  }
});



module.exports = router;
