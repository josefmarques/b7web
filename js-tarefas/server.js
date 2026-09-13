const path = require('path');
const { Pool } = require('pg');

const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT) || 5432,
  user: process.env.DB_USER || 'zemarques',
  password: process.env.DB_PASS || 'mrq831028',
  database: process.env.DB_NAME || 'tarefas-db'
});

async function inicializarBanco() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS tarefas (
      id SERIAL PRIMARY KEY,
      texto TEXT NOT NULL,
      concluida BOOLEAN NOT NULL DEFAULT false
    );
  `);
}

const express = require('express');
const app = express();

app.use(express.json());
app.use(express.static(path.join(__dirname)));

app.get('/api/tarefas', async function (req, res) {
  try {
    const resultado = await pool.query(
      'SELECT id, texto, concluida FROM tarefas ORDER BY id;'
    );
    res.json(resultado.rows);
  } catch (erro) {
    res.status(500).json({ erro: 'Erro ao buscar tarefas' });
  }
});

app.post('/api/tarefas', async function (req, res) {
  const texto = (req.body.texto || '').trim();

  if (texto === '') {
    return res.status(400).json({ erro: 'Texto da tarefa é obrigatório' });
  }

  try {
    const resultado = await pool.query(
      'INSERT INTO tarefas (texto) VALUES ($1) RETURNING id, texto, concluida;',
      [texto]
    );
    res.status(201).json(resultado.rows[0]);
  } catch (erro) {
    res.status(500).json({ erro: 'Erro ao adicionar tarefa' });
  }
});

app.put('/api/tarefas/:id', async function (req, res) {
  try {
    const resultado = await pool.query(
      'UPDATE tarefas SET concluida = NOT concluida WHERE id = $1 RETURNING id, texto, concluida;',
      [req.params.id]
    );

    if (resultado.rowCount === 0) {
      return res.status(404).json({ erro: 'Tarefa não encontrada' });
    }

    res.json(resultado.rows[0]);
  } catch (erro) {
    res.status(500).json({ erro: 'Erro ao alternar tarefa' });
  }
});

app.delete('/api/tarefas/:id', async function (req, res) {
  try {
    const resultado = await pool.query(
      'DELETE FROM tarefas WHERE id = $1;',
      [req.params.id]
    );

    if (resultado.rowCount === 0) {
      return res.status(404).json({ erro: 'Tarefa não encontrada' });
    }

    res.status(204).send();
  } catch (erro) {
    res.status(500).json({ erro: 'Erro ao deletar tarefa' });
  }
});

const PORT = Number(process.env.PORT) || 3000;

inicializarBanco()
  .then(function () {
    app.listen(PORT, function () {
      console.log('Servidor rodando na porta ' + PORT);
    });
  })
  .catch(function (erro) {
    console.error('Erro ao inicializar o banco de dados:', erro);
    process.exit(1);
  });