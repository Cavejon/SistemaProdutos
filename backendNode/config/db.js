// backend/config/db.js

const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Caminho para o arquivo do banco de dados SQLite
// Ele será criado no diretório raiz do seu projeto backend
const dbPath = path.resolve(__dirname, '../database.sqlite');

// Cria uma nova instância do banco de dados
// new sqlite3.Database(dbPath) cria o arquivo se ele não existe
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Erro ao conectar ao banco de dados SQLite:', err.message);
    } else {
        // A mensagem de conexão também está no server.js para ser mais visível na inicialização
        // console.log('Conexão bem-sucedida ao SQLite!');
    }
});

module.exports = db;