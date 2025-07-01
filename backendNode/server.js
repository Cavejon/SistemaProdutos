require('dotenv').config();

const express = require('express');
const cors = require('cors'); // Se voc estiver usando CORS, é uma boa prática incluí-lo
const sqlite3 = require('sqlite3'); // Importe  sqlite3 se estiver inicializando o DB aqui

const app = express();
const PORT = process.env.PORT || 3000;

// --- MIDDLEWARE ESSENCIAIS ---
// 1. Permit requisições de outras origens (frontend em outra porta/domínio)
app.use(cors());

// 2. Middlewar para parsear o corpo das requisições JSON.
// ESSENCIAL par que req.body funcione com Content-Type: application/json
app.use(express.json());

// 3. Middlewar para parsear o corpo das requisições URL-encoded (dados de formulário).
// Útil s você também lida com formulários HTML tradicionais.
app.use(express.urlencoded({ extended: true }));
// --- FI DOS MIDDLEWARES ---

// Conexão co o banco de dados
// Garanta qu o caminho para o seu 'db' está correto.
// Se se db.js exporta a instância de 'sqlite3.Database', a linha abaixo está certa.
const db = require('./config/db');

// Inicialização d banco de dados e criação da tabela de usuários
db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT NOT NULL UNIQUE,
        email TEXT NOT NULL UNIQUE,
        password TEXT NOT NULL,
        role TEXT DEFAULT 'user'
    )`, (err) => {
        if (err) {
            console.error("Erro ao criar a tabela 'users':", err.message);
        } else {
            console.log('Conectado ao SQLite! Tabela de usuários verificada/criada.');
        }
    });
});

// Importação da rotas (DEPOIS dos middlewares)
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const productRoutes = require('./routes/productRoutes'); // Adicione esta linha

// Uso da rotas
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes); // E esta linha

// Rota d teste simples (opcional)
app.get('/', (req, res) => {
    res.send('API Node.js funcionando!');
});

// Inicia  servidor
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});

// router.post('/', authMiddleware, productController.createProduct);