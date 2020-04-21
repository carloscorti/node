// passport mantiene el object user en la session
// utiliza las cookies y las utiliza en la session
const passport = require('passport');
// importo la estrategia de autenticacion,
// en teste caso uso estrategia de autenticacion local con user y password
// con package 'passport-local'
// podria hacerlo con google, facebook, tweeter, linkdin, etc
// hay que ejectutar la strategy ya que es importada como una funcion
require('./strategies/local.strategy.js')();

function passportConfig(app) {
  // https://stackoverflow.com/questions/46644366/what-is-passport-initialize-nodejs-express
  // https://github.com/jaredhanson/passport/blob/2327a36e7c005ccc7134ad157b2f258b57aa0912/lib/middleware/initialize.js
  // inicializa passport en la app, en la request a medida que las tiene
  // crea por ejemplo login en request (req de .post del authRouter)
  // So basically passport.initialize() initialises the authentication module.
  app.use(passport.initialize());
  // genera la session y es de donde se van a sacar todos los datos
  // es donde se van a llamar los users
  // passport.session() is another middleware that alters the request object
  // and change the 'user' value that is currently the session id (from the client cookie)
  // into the true deserialized user object
  app.use(passport.session());
  // guarda el user en la session ejecutando la funcion de su argumento
  // el argumento es el user y una callback (done)
  // done se usa para guardarlo en la session
  passport.serializeUser((user, done) => {
    // la forma de la callback es callback(err, something)
    // en este caso err es null, something es user (el objet user)
    // se puede pasar solo parte del objeto user, por ejemplo user.id
    done(null, user);
  });
  // recupera el user de la ejecutando la funcion de su argumento
  passport.deserializeUser((user, done) => {
    // la forma de la callback es callback(err, something)
    // en este caso err es null, something es user (el objet user)
    // si paso user.id en el done de .serializeUser
    // aqui lo que recupero de la session es userId y no todo el objeto user
    // seria .deserializeUser((userId, done)
    done(null, user);
  });
}

module.exports = passportConfig;
