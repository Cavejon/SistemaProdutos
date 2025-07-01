// backend/controllers/productController.js
const db = require('../config/db');

exports.createProduct = (req, res) => {
    const { name, description, category } = req.body;
    db.run(
        'INSERT INTO products (name, description, category) VALUES (?, ?, ?)',
        [name, description, category],
        function (err) {
            if (err) {
                return res.status(400).json({ error: 'Erro ao criar produto', details: err.message });
            }
            res.status(201).json({ id: this.lastID, name, description, category });
        }
    );
};

exports.getAllProducts = (req, res) => {
    db.all('SELECT * FROM products', [], (err, rows) => {
        if (err) {
            return res.status(500).json({ error: 'Erro ao buscar produtos' });
        }
        res.json(rows);
    });
};

exports.getProductById = (req, res) => {
    const { id } = req.params;
    db.get('SELECT * FROM products WHERE id = ?', [id], (err, row) => {
        if (err || !row) {
            return res.status(404).json({ error: 'Produto não encontrado' });
        }
        res.json(row);
    });
};