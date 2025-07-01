// backend/models/Feedback.js
const connection = require('../config/db');

class Feedback {
    static create(productId, userId, rating, comment) {
        const query = 'INSERT INTO feedbacks (product_id, user_id, rating, comment) VALUES (?, ?, ?, ?)';
        return new Promise((resolve, reject) => {
            connection.query(query, [productId, userId, rating, comment], (err, result) => {
                if (err) return reject(err);
                resolve(result);
            });
        });
    }

    static getPendingFeedbacks() {
        const query = `
            SELECT
                f.id,
                f.product_id,
                p.name AS product_name,
                f.user_id,
                u.username AS user_username,
                f.rating,
                f.comment,
                f.status,
                f.created_at
            FROM
                feedbacks f
            JOIN
                products p ON f.product_id = p.id
            JOIN
                users u ON f.user_id = u.id
            WHERE
                f.status = 'pending'
            ORDER BY
                f.created_at DESC;
        `;
        return new Promise((resolve, reject) => {
            connection.query(query, (err, results) => {
                if (err) return reject(err);
                resolve(results);
            });
        });
    }

    static updateStatus(feedbackId, status) {
        const query = 'UPDATE feedbacks SET status = ? WHERE id = ?';
        return new Promise((resolve, reject) => {
            connection.query(query, [status, feedbackId], (err, result) => {
                if (err) return reject(err);
                resolve(result);
            });
        });
    }

    static findById(id) {
        const query = 'SELECT * FROM feedbacks WHERE id = ?';
        return new Promise((resolve, reject) => {
            connection.query(query, [id], (err, results) => {
                if (err) return reject(err);
                resolve(results[0]);
            });
        });
    }
}

module.exports = Feedback;