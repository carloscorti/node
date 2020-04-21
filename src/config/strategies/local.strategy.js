// el objetivo de este archivo es pasarle la strategy a password

const passport = require('passport');
// saco solo Strategy de 'passport-local'
const { Strategy } = require('passport-local');
const { MongoClient } = require('mongodb');
const debug = require('debug')('app:local.strategy');


function localStrategy() {
  // new Strategy(formDataObject, validateUserFunction(username, password, callback))
  // son los parametros de la Strategy
  passport.use(new Strategy(
    // defino cuales son los campos username y pasword referidos al form con el post en el html
    // de esta manera Strategy saca eso del body del post
    {
      usernameField: 'username',
      passwordField: 'password',
    },
    // defino que hacer con esos campos con una funcion
    // la funcion va a recibir username, password y callback (done)
    // aqui valido que es un user
    // cuando hago log in con username y password
    // los pasa como argumentos de la funcion atravez de
    // .post(passport.authenticate(...)); en authRouter.js
    (username, password, done) => {
      const url = 'mongodb://localhost:27017';
      const dbName = 'libraryApp';
      (async function mongoUser() {
        let client;
        try {
          client = await MongoClient.connect(url, { useUnifiedTopology: true });
          debug('Server connected');

          const db = client.db(dbName);

          // en .findOne({ username }); es igual a poner .findOne({ username: username });
          // que es el username del argumento de la funcion
          // que es el ingresado por el usuario en signin
          const userToCheck = await db.collection('users').findOne({ username });
          debug(userToCheck);

          // comparo password es el argumento de la funcion
          // que es el ingresado por el usuario en signin
          if (userToCheck.password === password) {
            // done(err, succes)
            // err lo paso como null
            // si esta bien paso el usuario de la base de datos para hacer el perfil
            // redirigiendo "userToCheck" con "successRedirect: '/auth/porfile'," en authRouter.js
            done(null, userToCheck);
          } else {
            // done(err, succes)
            // err lo paso como null, porque es una falla no un error,
            // como esta mal paso la falla
            // para que redirija con "failureRedirect: '/'," en authRouter.js
            done(null, false);
          }
        } catch (err) {
          // en caso de error redirijo como falla
          // como esta mal paso la falla
          // para que redirija con "failureRedirect: '/'," en authRouter.js
          done(null, false);
          debug(err.stack);
        } finally {
          await client.close();
          debug('Connection closed');
        }
      }());
    }
  ));
}

module.exports = localStrategy;
