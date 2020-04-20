const express = require('express');
const { MongoClient } = require('mongodb');
const debug = require('debug')('app:authRouter');

const authRouter = express.Router();
function router() {
  authRouter.route('/signUp')
    .post((req, res) => {
      debug(req.body);
      // para crear un user, tomo el username y password de req.body
      // .login me lo agrega a req app.use(passport.initialize()) en passport.js
      // al invocarlo en app.js con require('./src/config/passport.js')(app);
      // aca logueo el user y luego redirijo para mostrar el user ya creado
      // para loguear passport usa el .serializeUser de passport.js para agregarlo a la session
      req.login(req.body, () => {
        // redirecciona a auth/profile
        res.redirect('/auth/profile');
      });
    });

  authRouter.route('/profile')
    .get((req, res) => {
      debug(req.user);
      // password me adjunta el user creado a la request (al req)
      // aca muestro el user creado con req.login del .post
      // usa .deserializeUser de passport.js para sacar el user de la session
      // crear al usuario y poder mostrarlo
      res.json(req.user);
    });


  return authRouter;
}

// el modulo exporta la funcion que devuelve el router
module.exports = router;
