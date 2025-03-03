
const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
    const token = req.header('Authorization');
    if (!token) return res.status(401).json({ message: 'Authorization denied' });

    try {
        const decoded = jwt.verify(token, 'your_secret_key');
        req.user = decoded;
        next();
    } catch (err) {
        res.status(400).json({ message: 'Invalid token' });
    }
};

module.exports = auth;