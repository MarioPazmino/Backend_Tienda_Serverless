// Script para generar un hash bcrypt de una contraseña
const bcrypt = require('bcryptjs');

const password = '';
const saltRounds = 10;

bcrypt.hash(password, saltRounds, function(err, hash) {
  if (err) {
    console.error('Error generando el hash:', err);
  } else {
    console.log('Hash bcrypt para', password, ':', hash);
  }
});
