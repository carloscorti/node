// el objetivo de este archivo es pasarle la strategy a password

const passport = require('passport');
// saco solo Strategy de 'passport-local'
const { Strategy } = require('passport-local');

function localStrategy() {
  // paso la local strategy a passport
  // diferentes styrategies tienen diferentes argumentos para el objeto Strategy
  // aca setteo como manejarse como username y password y como identificarlo como user
  // el constructor de Strategy es asi
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
    // cuando hago log in con username y password crea un user nuevo
    // este user es el que adjunta a req
    (username, password, done) => {
      // creo un user
      const user = {
        username,
        password,
      };
      // paso ese user a la funcion done
      done(null, user);
    }
  ));
}

module.exports = localStrategy;
