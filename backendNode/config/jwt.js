// backend/config/jwt.js
module.exports = {
    secret: process.env.JWT_SECRET || 'supersecretjwtkey',
    expiresIn: '1h'
};