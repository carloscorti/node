const express = require('express');
const { MongoClient } = require('mongodb');
const debug = require('debug')('app:authRouter');
// para autenticar los datos de signin
const passport = require('passport');

const authRouter = express.Router();
function router(nav) {
  authRouter.route('/signUp')
    .post((req, res) => {
      const url = 'mongodb://localhost:27017';
      const dbName = 'libraryApp';
      (async function addUser() {
        const { username, password } = req.body;
        const user = { username, password };
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
      }());
    });

  authRouter.route('/signIn')
    .get((req, res) => {
      res.render(
        'signin',
        {
          nav,
          title: 'Sign In',
        }
      );
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
    .get((req, res) => {
      // req es response.ops[0]
      // y cuando redirije successRedirect: '/auth/profile', es userToCkeck
      res.json(req.user);
    });


  return authRouter;
}

module.exports = router;
