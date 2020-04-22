const express = require('express');
const { MongoClient } = require('mongodb');
const debug = require('debug')('app:authRouter');
// para autenticar los datos de signin
const passport = require('passport');

const authRouter = express.Router();
function router(nav) {
  authRouter.route('/signUp')
    .get((req, res) => { res.redirect('/'); })
    .post((req, res) => {
      const url = 'mongodb://localhost:27017';
      const dbName = 'libraryApp';
      (async function addUser() {
        const { username, password } = req.body;
        const user = { username, password };
        if (user.username) {
          let client;
          try {
            client = await MongoClient.connect(url, { useUnifiedTopology: true });
            debug('Server connected');

            const db = client.db(dbName);

            const response = await db.collection('users').insertOne(user);

            req.login(response.ops[0], () => {
              res.redirect('/auth/profile');
            });
          } catch (err) {
            debug(err.stack);
          } finally {
            await client.close();
            debug('Connection closed');
          }
        } else {
          res.redirect('/');
        }
      }());
    });

  authRouter.route('/signIn')
    // si un usuario se registro local strategy agrego user a req
    // si es asi no muestra la pagina signin signup
    .get((req, res) => {
      if (req.user) {
        res.redirect(nav[0].link);
      } else {
        res.render(
          'signin',
          {
            nav,
            title: 'Sign In',
          }
        );
      }
    })

    // le paso los datos a password para authenticate password.authenticate()
    // paso la strategy, ej: local, facebook, tweeter (lo que haya configurado en strategy)
    // le paso un objeto con los redirecto onsuccess y onfailure
    // ahora cuando hago signin le paso la informacion a local.strategy para que la maneje
    .post(passport.authenticate('local',
      {
        successRedirect: '/auth/profile',
        failureRedirect: '/',
      }));

  authRouter.route('/profile')
    // utilizo un middleware para que cada vez que llegue a '.../profile'
    // verifique si la validacion devolvio un usuario en local.strategy,js
    // si devolvio es que el usuario esta en la base de datos
    // sino no esta registrado y por lo tando lo devuelve '.../' que es signUp singIn
    .all((req, res, next) => {
      if (req.user) {
        debug(req.user);
        next();
      } else {
        debug('redirigio');
        res.redirect('/');
      }
    })

    .get((req, res) => {
      // req.user es response.ops[0]
      // y cuando redirije successRedirect: '/auth/profile', es userToCkeck
      res.render(
        'profile',
        {
          nav,
          title: nav[1].title,
          user: req.user,
        }
      );
    });

  authRouter.route('/logout')
    .all((req, res, next) => {
      if (req.user) {
        debug('logout')
        debug(req.user);
        next();
      } else {
        debug('redirigio');
        res.redirect('/');
      }
    })

    .get((req, res) => {
      req.logout();
      res.redirect('/');
    });


  return authRouter;
}

module.exports = router;
