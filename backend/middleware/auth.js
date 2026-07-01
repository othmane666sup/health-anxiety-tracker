const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  const header = req.headers.authorization;
  if (!header) return res.status(401).json({ error: 'غير مصرح' });
  const token = header.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'dayflow_secret');
    req.userId = decoded.userId;
    next();
  } catch {
    res.status(401).json({ error: 'جلسة منتهية، يرجى تسجيل الدخول' });
  }
};
