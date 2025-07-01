// backend/controllers/authController.js

const User = require('../models/User'); // Importa o modelo de usuário
const bcrypt = require('bcryptjs');     // Importa bcryptjs para hash e comparação de senha
const jwt = require('jsonwebtoken');    // Importa jsonwebtoken para gerar tokens
const jwtConfig = require('../config/jwt'); // Importa as configurações do JWT (secret, expiresIn)

exports.register = async (req, res) => {
    // Desestrutura os dados do corpo da requisição
    const { username, email, password, role } = req.body;

    // --- LINHAS DE DEPURACÃO CRÍTICAS ---
    // Verifique o console do Node.js após cada tentativa de registro.
    // Estes logs nos dirão exatamente o que o backend está recebendo.
    console.log('--- DEBUG: Início do Registro ---');
    console.log(`  Recebido Username: ${username}`);
    console.log(`  Recebido Email: ${email}`);
    console.log(`  Recebido Password: ${password}`); // ESTE DEVE TER UM VALOR!
    console.log(`  Recebido Role: ${role}`);
    console.log('--- Fim do Debug de Recebimento ---');
    // --- FIM DAS LINHAS DE DEPURACÃO ---

    try {
        // 1. Verifica se o email já está cadastrado
        const existingUser = await User.findByEmail(email);
        if (existingUser) {
            console.log(`Tentativa de registro com email existente: ${email}`);
            return res.status(400).json({ message: 'Este email já está cadastrado.' });
        }

        // 2. Cria o novo usuário no banco de dados via o modelo User
        // O método User.create fará o hash da senha internamente.
        const newUser = await User.create(username, email, password, role);

        // 3. Responde com sucesso
        console.log(`Usuário "${newUser.username}" registrado com sucesso! ID: ${newUser.id}`);
        res.status(201).json({
            id: newUser.id,
            username: newUser.username,
            email: newUser.email,
            role: newUser.role,
            message: 'Usuário registrado com sucesso!'
        });
    } catch (error) {
        // Captura e loga qualquer erro ocorrido durante o registro
        console.error('Erro ao registrar usuário (authController):', error.message || error);

        // Fornece uma mensagem de erro mais específica para o frontend, se possível
        if (error.message && error.message.includes('senha inválida ou vazia')) {
            return res.status(400).json({ message: 'A senha fornecida é inválida. Por favor, insira uma senha.' });
        }
        if (error.message && error.message.includes('UNIQUE constraint failed')) {
            // Este erro ocorre se, por exemplo, o username também for UNIQUE e já existir
            return res.status(400).json({ message: 'Nome de usuário ou email já em uso.' });
        }
        res.status(500).json({ message: 'Erro interno ao registrar usuário.' });
    }
};

exports.login = async (req, res) => {
    const { email, password } = req.body;

    // --- LINHAS DE DEPURACÃO PARA LOGIN ---
    console.log('--- DEBUG: Início do Login ---');
    console.log(`  Tentativa de login para Email: ${email}`);
    // **NÃO LOGUE SENHAS EM PRODUÇÃO!** Apenas para depuração.
    // console.log(`  Senha fornecida (para debug): ${password}`);
    console.log('--- Fim do Debug de Login ---');
    // --- FIM DAS LINHAS DE DEPURACÃO ---

    try {
        // 1. Encontra o usuário pelo email
        const user = await User.findByEmail(email);

        // 2. Verifica se o usuário existe e se possui uma senha (para evitar erros de null/undefined)
        if (!user || !user.password) {
            console.log(`Tentativa de login falhou: Usuário não encontrado ou senha ausente para ${email}`);
            return res.status(401).json({ message: 'Email ou senha inválidos.' });
        }

        // 3. Compara a senha fornecida com o hash armazenado no banco de dados
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            console.log(`Tentativa de login falhou: Senha incorreta para ${email}`);
            return res.status(401).json({ message: 'Email ou senha inválidos.' });
        }

        // 4. Gera o token JWT para o usuário autenticado
        const token = jwt.sign(
            { id: user.id, role: user.role },
            jwtConfig.secret,
            { expiresIn: jwtConfig.expiresIn } // Tempo de expiração do token
        );

        // 5. Responde com o token e dados do usuário
        console.log(`Usuário "${user.username}" logado com sucesso!`);
        res.status(200).json({ token, userId: user.id, role: user.role, username: user.username });
    } catch (error) {
        // Captura e loga erros durante o processo de login
        console.error('Erro no login (authController):', error.message || error);
        res.status(500).json({ message: 'Erro interno ao fazer login.' });
    }
};