// backend/controllers/userController.js
const User = require('../models/User');
const db = require('../config/db');
const bcrypt = require('bcrypt');

exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.getAll();
        res.status(200).json(users);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erro ao buscar usuários.' });
    }
};

exports.deleteUser = async (req, res) => {
    const userId = req.params.id;
    try {
        const result = await User.delete(userId);
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Usuário não encontrado.' });
        }
        res.status(200).json({ message: 'Usuário deletado com sucesso.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erro ao deletar usuário.' });
    }
};

exports.register = (req, res) => {
  const { nome, email, senha, role } = req.body;
  if (!senha) {
    return res.status(400).json({ error: 'Senha é obrigatória' });
  }
  const hashedPassword = bcrypt.hashSync(senha, 10);

  db.run(
    'INSERT INTO users (nome, email, senha, role) VALUES (?, ?, ?, ?)',
    [nome, email, hashedPassword, role || 'user'],
    function (err) {
      if (err) {
        return res.status(400).json({ error: 'Erro ao registrar usuário', details: err.message });
      }
      res.status(201).json({ id: this.lastID, nome, email, role: role || 'user' });
    }
  );
};

exports.getAll = (req, res) => {
  db.all('SELECT id, nome, email, role FROM users', [], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: 'Erro ao buscar usuários' });
    }
    res.json(rows);
  });
};