const { Sequelize, DataTypes } = require('sequelize');

// Configura a conexão com o banco de dados PostgreSQL
const sequelize = new Sequelize('Mines_Master', 'postgres', 'Admin', {
  host: 'localhost',
  dialect: 'postgres',
  logging: false, // Desativa logs SQL no console
});

// Define o modelo da tabela 'usuarios'
const Usuario = sequelize.define('Usuario', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  username: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  senha: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  token_recuperacao: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  token_expira_em: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  tipousuario: {
  type: DataTypes.STRING,
  allowNull: false,
  validate: {
    isIn: [['admin', 'cliente']], // valida apenas esses dois valores
  },
}
}, {
  tableName: 'usuarios',
  schema: 'public',
  timestamps: false,
});

// Define o modelo da tabela 'partidas'
const Partida = sequelize.define('Partida', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  usuario_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Usuario,
      key: 'id',
    },
  },
  pontuacao: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  tempo_em_segundos: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  dificuldade: {
    type: DataTypes.STRING(50),
    allowNull: true,
  },
  data_jogada: {
    type: DataTypes.DATE,
    defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
    allowNull: false,
  },
}, {
  tableName: 'partidas',
  schema: 'public',
  timestamps: false,
});

// Define a associação entre Usuario e Partida
Usuario.hasMany(Partida, { foreignKey: 'usuario_id' });
Partida.belongsTo(Usuario, { foreignKey: 'usuario_id' });


// Testa a conexão com o banco de dados
sequelize.authenticate()
  .then(() => {
    console.log('Conexão com o banco de dados estabelecida.');
  })
  .catch(error => {
    console.error('Erro ao conectar ao banco de dados:', error);
  });

module.exports = { Usuario, Partida, sequelize };
