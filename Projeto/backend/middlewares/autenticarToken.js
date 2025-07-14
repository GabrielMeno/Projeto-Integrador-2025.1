const jwt = require('jsonwebtoken');

function autenticarToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Token não fornecido' });
  }

  jwt.verify(token, process.env.JWT_SECRET || 'segredo', (err, usuario) => {
    if (err) {
      return res.status(403).json({ error: 'Token inválido' });
    }

    if (!usuario || (typeof usuario.id === 'undefined' && typeof usuario.codigo_usuario === 'undefined')) {
      return res.status(403).json({ error: 'Token inválido - ID de usuário ausente' });
    }
    
    if (!usuario.codigo_usuario && usuario.id) {
      usuario.codigo_usuario = usuario.id;
    }
    
    req.usuario = usuario;
    
    next();
  });
}

module.exports = autenticarToken;
