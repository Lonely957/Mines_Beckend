const express = require('express');
const cors = require('cors');
const { Usuario, Partida, sequelize } = require('./db'); // Ajuste o caminho conforme necessário

const app = express();
const port = 3000;
const { Op } = require('sequelize');


app.use(cors());
app.use(express.json());

// ---------------------- ROTAS PARA USUÁRIOS ----------------------

// Rota de login
app.post('/usuario/login', async (req, res) => {
  console.log('Requisição recebida:', req.body);

  const { email, senha } = req.body;

  if (!email || !senha) {
    return res.status(400).json({ error: 'Email e senha são obrigatórios.' });
  }

  try {
    const usuario = await Usuario.findOne({ where: { email } });

    if (!usuario) {
      return res.status(404).json({ error: 'Usuário não encontrado.' });
    }

    if (usuario.senha !== senha) {
      return res.status(401).json({ error: 'Senha incorreta.' });
    }

    res.json({
      message: 'Login realizado com sucesso!',
      usuario: {
        id: usuario.id,
        username: usuario.username,
        email: usuario.email,
        tipousuario: usuario.tipousuario,
      },
    });
  } catch (error) {
    console.error('Erro ao fazer login:', error);
    res.status(500).json({ error: 'Erro ao tentar realizar o login.' });
  }
});
// Rota para obter todos os usuários
app.get('/usuario', async (req, res) => {
  try {
    const usuarios = await Usuario.findAll();
    res.json(usuarios);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar usuários.' });
  }
});
// Rota para obter um usuário por ID
app.get('/usuario/:id', async (req, res) => {
  try {
    const usuario = await Usuario.findByPk(req.params.id);
    if (usuario) {
      res.json(usuario);
    } else {
      res.status(404).send('Usuário não encontrado');
    }
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar usuário.' });
  }
});

app.post('/usuario/inserir', async (req, res) => {
  try {
    const { username, senha, email, tipousuario } = req.body;

    console.log('Requisição recebida em /usuario/inserir');
    console.log('Dados recebidos:', req.body);

    // Validação básica de campos obrigatórios
    if (!username || !senha) {
      console.warn('Campos obrigatórios faltando:', { username, senha });
      return res.status(400).json({ error: 'Username e senha são obrigatórios.' });
    }

    // Confirmar o conteúdo individual
    console.log('Username:', username);
    console.log('Senha:', senha);
    console.log('Email:', email);
    console.log('Tipo de Usuário:', tipousuario);

    const novoUsuario = await Usuario.create({
      username: username.trim(),
      senha: senha.trim(),
      email: email ? email.trim() : null,
      tipousuario: tipousuario ? tipousuario.trim() : null,
    });

    console.log('Usuário criado com sucesso:', novoUsuario);

    res.status(201).json(novoUsuario);
  } catch (error) {
    console.error('Erro ao inserir usuário:', error); // Log completo do erro
    res.status(500).json({ error: 'Erro ao inserir usuário.', detalhes: error.message });
  }
});

// Rota para atualizar usuário
app.put('/usuario/atualizar/:id', async (req, res) => {
  console.log('Requisição recebida para atualizar dados do usuário:', req.body);

  const { username, email, senha, tipousuario } = req.body;
  const { id } = req.params;

  if (!username || !email || !senha || typeof tipousuario === 'undefined') {
    return res.status(400).json({ error: 'Username, email, senha e tipo de usuário são obrigatórios.' });
  }

  try {
    const usuario = await Usuario.findByPk(id);

    if (!usuario) {
      return res.status(404).json({ error: 'Usuário não encontrado.' });
    }

    usuario.username = username.trim();
    usuario.email = email.trim();
    usuario.senha = senha.trim();
    usuario.tipousuario = tipousuario; 


    await usuario.save();

    res.json({
      message: 'Dados do usuário atualizados com sucesso!',
      usuario: {
        id: usuario.id,
        username: usuario.username,
        email: usuario.email,
        tipousuario: usuario.tipousuario,
      },
    });
  } catch (error) {
    console.error('Erro ao atualizar os dados do usuário:', error);
    res.status(500).json({ error: 'Erro ao tentar atualizar os dados do usuário.' });
  }
});

// Rota para alterar a senha do usuário usando EMAIL
app.put('/usuario/alterar-senha', async (req, res) => {
  console.log('Requisição recebida para alterar senha:', req.body);

  const { email, senhaAtual, novaSenha } = req.body;

  if (!email || !senhaAtual || !novaSenha) {
    return res.status(400).json({ error: 'Email, senha atual e nova senha são obrigatórios.' });
  }

  try {
    const usuario = await Usuario.findOne({ where: { email } });

    if (!usuario) {
      return res.status(404).json({ error: 'Usuário não encontrado.' });
    }

    if (usuario.senha.trim() !== senhaAtual.trim()) {
      return res.status(401).json({ error: 'Senha atual incorreta.' });
    }

    usuario.senha = novaSenha.trim();
    await usuario.save();

    res.json({
      message: 'Senha alterada com sucesso!',
      usuario: {
        id: usuario.id,
        username: usuario.username,
        email: usuario.email,
      },
    });
  } catch (error) {
    console.error('Erro ao alterar a senha:', error);
    res.status(500).json({ error: 'Erro ao tentar alterar a senha.' });
  }
});



// Rota para redefinir senha do usuário
app.put('/usuarios/redefinir-senha', async (req, res) => {
  console.log('Requisição recebida para redefinir senha:', req.body);

  const { email, novaSenha, confirmarSenha } = req.body;

  if (!email || !novaSenha || !confirmarSenha) {
    return res.status(400).json({ error: 'Email, nova senha e confirmação são obrigatórios.' });
  }

  if (novaSenha.trim() !== confirmarSenha.trim()) {
    return res.status(400).json({ error: 'As senhas não coincidem.' });
  }

  try {
    const usuario = await Usuario.findOne({ where: { email } });

    if (!usuario) {
      return res.status(404).json({ error: 'Usuário não encontrado.' });
    }

    usuario.senha = novaSenha.trim();
    await usuario.save();

    res.json({
      message: 'Senha redefinida com sucesso!',
      usuario: {
        id: usuario.id,
        username: usuario.username,
        email: usuario.email,
      },
    });
  } catch (error) {
    console.error('Erro ao redefinir a senha:', error);
    res.status(500).json({ error: 'Erro ao tentar redefinir a senha.' });
  }
});

// Rota para envio de código de recuperação por email
app.post('/recuperar-senha', async (req, res) => {
  console.log('Requisição recebida para recuperar senha:', req.body);

  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ error: 'Email é obrigatório.' });
  }

  try {
    const usuario = await Usuario.findOne({ where: { email } });

    if (!usuario) {
      return res.status(404).json({ error: 'Usuário não encontrado.' });
    }

    // Aqui você pode gerar um código ou token de recuperação e enviar por email
    // Por enquanto, vamos apenas simular que enviou o código:
    console.log(`Código de recuperação enviado para o email: ${email}`);

    res.json({ message: 'Código de recuperação enviado com sucesso!' });
  } catch (error) {
    console.error('Erro ao enviar código de recuperação:', error);
    res.status(500).json({ error: 'Erro ao tentar enviar código de recuperação.' });
  }
});


// Rota para deletar um usuário
app.delete('/usuario/deletar/:id', async (req, res) => {
  try {
    const usuario = await Usuario.findByPk(req.params.id);
    if (usuario) {
      await usuario.destroy();
      res.json({ message: 'Usuário deletado com sucesso.' });
    } else {
      res.status(404).send('Usuário não encontrado');
    }
  } catch (error) {
    res.status(500).json({ error: 'Erro ao deletar usuário.' });
  }
});


// ---------------------- ROTAS PARA PARTIDAS ----------------------

// Rota para registrar uma partida
app.post('/partida/registrar', async (req, res) => {
  console.log('Requisição recebida em /partida/registrar:', req.body);

  const { usuarioId, pontuacao, tempo, dificuldade } = req.body;

  // Validação básica
  if (!usuarioId || pontuacao == null || tempo == null || !dificuldade) {
    return res.status(400).json({ 
      error: 'usuarioId, pontuacao, tempo e dificuldade são obrigatórios.' 
    });
  }

  try {
    // Verifica se o usuário existe
    const usuario = await Usuario.findByPk(usuarioId);
    if (!usuario) {
      return res.status(404).json({ error: 'Usuário não encontrado.' });
    }

    // Cria a nova partida
    const novaPartida = await Partida.create({
      usuario_id: usuarioId,
      pontuacao,
      tempo_em_segundos: tempo,
      dificuldade
    });

    console.log('Partida registrada com sucesso:', novaPartida);

    res.status(201).json({ 
      message: 'Partida registrada com sucesso!',
      partida: novaPartida 
    });
  } catch (error) {
    console.error('Erro ao registrar partida:', error);
    res.status(500).json({ error: 'Erro ao registrar partida.', detalhes: error.message });
  }
});

// Rota para obter estatísticas do usuário
app.get('/usuario/:id/estatisticas', async (req, res) => {
  const { id } = req.params;

  try {
    // Verifica se o usuário existe
    const usuario = await Usuario.findByPk(id);
    if (!usuario) {
      return res.status(404).json({ error: 'Usuário não encontrado.' });
    }

    // Busca quantidade de vitórias
    const vitorias = await Partida.count({
      where: {
        usuario_id: id,
        // Se tiver um campo 'foi_vitoria', descomente:
        // foi_vitoria: true
        pontuacao: { [Op.gte]: 100 }  // Exemplo: considera vitória pontuação >= 100
      }
    });

    // Busca melhor tempo
    const melhorTempo = await Partida.min('tempo_em_segundos', {
      where: { usuario_id: id }
    });

    // Busca melhor pontuação
    const melhorPontuacao = await Partida.max('pontuacao', {
      where: { usuario_id: id }
    });

    res.json({
      vitorias,
      melhorTempo: melhorTempo !== null ? melhorTempo : null,
      melhorPontuacao: melhorPontuacao !== null ? melhorPontuacao : null
    });

  } catch (error) {
    console.error('Erro ao obter estatísticas do usuário:', error);
    res.status(500).json({ error: 'Erro ao obter estatísticas do usuário.' });
  }
});

// Rota para obter o histórico de partidas de um usuário
app.get('/usuario/:id/historico', async (req, res) => {
  const { id } = req.params;

  try {
    // Verifica se o usuário existe
    const usuario = await Usuario.findByPk(id);
    if (!usuario) {
      return res.status(404).json({ error: 'Usuário não encontrado.' });
    }

    // Busca todas as partidas do usuário, ordenadas da mais recente para a mais antiga
    const historico = await Partida.findAll({
      where: { usuario_id: id },
      order: [['createdAt', 'DESC']]  // ← importante: exibe do mais recente ao mais antigo
    });

    res.json({
      usuario: {
        id: usuario.id,
        username: usuario.username,
        email: usuario.email
      },
      historico
    });

  } catch (error) {
    console.error('Erro ao obter histórico de partidas:', error);
    res.status(500).json({ error: 'Erro ao obter histórico de partidas.' });
  }
});




// ---------------------- INICIALIZA SERVIDOR ----------------------
app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
