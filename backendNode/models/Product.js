// backend/models/Product.js
const connection = require('../config/db');

class Product {
    static create(name, description, category) {
        const query = 'INSERT INTO products (name, description, category) VALUES (?, ?, ?)';
        return new Promise((resolve, reject) => {
            connection.query(query, [name, description, category], (err, result) => {
                if (err) return reject(err);
                resolve(result);
            });
        });
    }

    static getAll() {
        // Trazendo a avaliação média junto com os produtos
        const query = `
            SELECT
                p.id,
                p.name,
                p.description,
                p.category,
                AVG(f.rating) AS average_rating
            FROM
                products p
            LEFT JOIN
                feedbacks f ON p.id = f.product_id AND f.status = 'approved'
            GROUP BY
                p.id
            ORDER BY
                p.created_at DESC;
        `;
        return new Promise((resolve, reject) => {
            connection.query(query, (err, results) => {
                if (err) return reject(err);
                resolve(results);
            });
        });
    }

    static findById(id) {
        const query = `
            SELECT
                p.id,
                p.name,
                p.description,
                p.category,
                AVG(f.rating) AS average_rating
            FROM
                products p
            LEFT JOIN
                feedbacks f ON p.id = f.product_id AND f.status = 'approved'
            WHERE
                p.id = ?
            GROUP BY
                p.id;
        `;
        return new Promise((resolve, reject) => {
            connection.query(query, [id], (err, results) => {
                if (err) return reject(err);
                resolve(results[0]);
            });
        });
    }

    static getProductFeedbacks(productId) {
        const query = `
            SELECT
                f.id,
                f.rating,
                f.comment,
                f.status,
                u.username AS user_username,
                f.created_at
            FROM
                feedbacks f
            JOIN
                users u ON f.user_id = u.id
            WHERE
                f.product_id = ? AND f.status = 'approved'
            ORDER BY
                f.created_at DESC;
        `;
        return new Promise((resolve, reject) => {
            connection.query(query, [productId], (err, results) => {
                if (err) return reject(err);
                resolve(results);
            });
        });
    }
}

module.exports = Product;