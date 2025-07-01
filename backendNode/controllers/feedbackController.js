// backend/controllers/feedbackController.js
const Feedback = require('../models/Feedback');
const db = require('../config/db');

exports.createFeedback = async (req, res) => {
    const { product_id, rating, comment } = req.body;
    const userId = req.userId; // Vem do middleware de autenticação

    if (!product_id || !rating) {
        return res.status(400).json({ message: 'ID do produto e avaliação são obrigatórios.' });
    }
    if (rating < 1 || rating > 5) {
        return res.status(400).json({ message: 'A avaliação deve ser entre 1 e 5.' });
    }

    try {
        await Feedback.create(product_id, userId, rating, comment);
        res.status(201).json({ message: 'Feedback enviado com sucesso! Aguardando moderação.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erro ao enviar feedback.' });
    }
};

exports.getPendingFeedbacks = async (req, res) => {
    try {
        const pendingFeedbacks = await Feedback.getPendingFeedbacks();
        res.status(200).json(pendingFeedbacks);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erro ao buscar feedbacks pendentes.' });
    }
};

exports.updateFeedbackStatus = async (req, res) => {
    const feedbackId = req.params.id;
    const { status } = req.body; // 'approved', 'rejected'

    if (!['approved', 'rejected'].includes(status)) {
        return res.status(400).json({ message: 'Status inválido. Use "approved" ou "rejected".' });
    }

    try {
        const feedback = await Feedback.findById(feedbackId);
        if (!feedback) {
            return res.status(404).json({ message: 'Feedback não encontrado.' });
        }

        await Feedback.updateStatus(feedbackId, status);
        res.status(200).json({ message: 'Status do feedback atualizado com sucesso.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erro ao atualizar status do feedback.' });
    }
};

exports.getAll = (req, res) => {
    db.all('SELECT * FROM feedbacks', [], (err, rows) => {
        if (err) {
            return res.status(500).json({ error: 'Erro ao buscar feedbacks' });
        }
        res.json(rows);
    });
};

exports.create = (req, res) => {
    const { user_id, product_id, comentario } = req.body;
    db.run(
        'INSERT INTO feedbacks (user_id, product_id, comentario) VALUES (?, ?, ?)',
        [user_id, product_id, comentario],
        function (err) {
            if (err) {
                return res.status(400).json({ error: 'Erro ao criar feedback', details: err.message });
            }
            res.status(201).json({ id: this.lastID, user_id, product_id, comentario });
        }
    );
};

exports.approve = (req, res) => {
    const { id } = req.params;
    db.run(
        'UPDATE feedbacks SET aprovado = 1 WHERE id = ?',
        [id],
        function (err) {
            if (err) {
                return res.status(400).json({ error: 'Erro ao aprovar feedback', details: err.message });
            }
            res.json({ success: true });
        }
    );
};