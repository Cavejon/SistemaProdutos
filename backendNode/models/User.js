// backend/models/User.js

const db = require('../config/db'); // Importa a instância do banco de dados
const bcrypt = require('bcryptjs'); // Importa a biblioteca de hash de senha

class User {
    /**
     * Cria um novo usuário no banco de dados.
     * @param {string} username
     * @param {string} email
     * @param {string} password - Senha em texto puro.
     * @param {string} [role='user'] - Papel do usuário (admin, user, etc.).
     * @returns {Promise<object>} Um objeto contendo id, username, email e role do novo usuário.
     */
    static async create(username, email, password, role = 'user') {
        try {
            // --- VALIDAÇÃO CRÍTICA PARA A SENHA ---
            // Esta verificação garante que a senha não é undefined/null/vazia
            // ANTES de tentar fazer o hash, que é a causa do erro "Illegal arguments".
            if (!password || typeof password !== 'string' || password.trim() === '') {
                throw new Error('A senha fornecida é inválida ou vazia.');
            }

            // Gera o hash da senha de forma assíncrona.
            // O '10' é o número de salt rounds (complexidade do hash).
            const hashedPassword = await bcrypt.hash(password, 10);

            // Envolve a operação de banco de dados db.run em uma Promise para usar async/await
            const result = await new Promise((resolve, reject) => {
                db.run(
                    'INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, ?)',
                    [username, email, hashedPassword, role],
                    function (err) { // Usamos 'function' para ter acesso a 'this.lastID'
                        if (err) {
                            console.error('Erro no db.run ao inserir usuário:', err.message);
                            return reject(err); // Rejeita a Promise em caso de erro no DB
                        }
                        // Resolve a Promise com os dados do usuário recém-criado
                        resolve({ id: this.lastID, username, email, role });
                    }
                );
            });
            return result;
        } catch (error) {
            // Loga o erro detalhadamente e o repropaga para o controlador
            console.error('Erro ao criar usuário no modelo User:', error.message || error);
            throw error;
        }
    }

    /**
     * Encontra um usuário pelo email.
     * @param {string} email
     * @returns {Promise<object | undefined>} O objeto do usuário ou undefined se não encontrado.
     */
    static async findByEmail(email) {
        try {
            // Envolve a operação de banco de dados db.get em uma Promise
            const row = await new Promise((resolve, reject) => {
                db.get('SELECT * FROM users WHERE email = ?', [email], (err, row) => {
                    if (err) {
                        console.error('Erro no db.get ao buscar por email:', err.message);
                        return reject(err);
                    }
                    resolve(row); // Retorna a linha (objeto) do usuário ou undefined
                });
            });
            return row;
        } catch (error) {
            console.error('Erro ao buscar usuário por email no modelo User:', error.message || error);
            throw error;
        }
    }

    /**
     * Encontra um usuário pelo ID.
     * @param {number} id
     * @returns {Promise<object | undefined>} O objeto do usuário (sem senha) ou undefined.
     */
    static async findById(id) {
        try {
            const row = await new Promise((resolve, reject) => {
                // Seleciona campos específicos para segurança, excluindo a senha
                db.get('SELECT id, username, email, role FROM users WHERE id = ?', [id], (err, row) => {
                    if (err) {
                        console.error('Erro no db.get ao buscar por ID:', err.message);
                        return reject(err);
                    }
                    resolve(row);
                });
            });
            return row;
        } catch (error) {
            console.error('Erro ao buscar usuário por ID no modelo User:', error.message || error);
            throw error;
        }
    }

    /**
     * Retorna todos os usuários (sem as senhas).
     * @returns {Promise<Array<object>>} Uma lista de objetos de usuário.
     */
    static async getAll() {
        try {
            const rows = await new Promise((resolve, reject) => {
                db.all('SELECT id, username, email, role FROM users', (err, rows) => {
                    if (err) {
                        console.error('Erro no db.all ao buscar todos os usuários:', err.message);
                        return reject(err);
                    }
                    resolve(rows);
                });
            });
            return rows;
        } catch (error) {
            console.error('Erro ao obter todos os usuários no modelo User:', error.message || error);
            throw error;
        }
    }

    /**
     * Deleta um usuário pelo ID.
     * @param {number} id
     * @returns {Promise<object>} Um objeto com a contagem de linhas afetadas.
     */
    static async delete(id) {
        try {
            const result = await new Promise((resolve, reject) => {
                db.run('DELETE FROM users WHERE id = ?', [id], function (err) {
                    if (err) {
                        console.error('Erro no db.run ao deletar usuário:', err.message);
                        return reject(err);
                    }
                    // 'this.changes' indica o número de linhas modificadas
                    resolve({ changes: this.changes });
                });
            });
            return result;
        } catch (error) {
            console.error('Erro ao deletar usuário no modelo User:', error.message || error);
            throw error;
        }
    }
}

module.exports = User;