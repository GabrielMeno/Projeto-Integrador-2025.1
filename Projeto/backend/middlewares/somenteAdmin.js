function somenteAdmin(req, res, next) {
  if (req.usuario && req.usuario.perfil === 'admin') {
    return next();
  }
  return res.status(403).json({ error: 'Acesso restrito a administradores.' });
}

module.exports = somenteAdmin;
