const express = require('express');
const chalk = require('chalk');
const debug = require('debug')('app');
const morgan = require('morgan');
const path = require('path');
const bodyParser = require('body-parser');
// passport mantiene el object user en la session
// utiliza las cookies y las utiliza en la session
// const passport = require('passport');
// para incluir las cookies dentro de la request (del req)
// lo necesitamos para usar passport
const cookieParser = require('cookie-parser');
// para crear sessions, lo necesitamos para passport
const session = require('express-session');

const app = express();

app.use(morgan('tiny'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
// invoco y llamo al cookieParser como middleware
app.use(cookieParser());
// invoco y llamo a session como middleware
// { secret: 'library' } se usa para contruir la cookie
app.use(session({ secret: 'library' }));

// configuracion de passport
require('./src/config/passport.js')(app);

app.use(express.static(path.join(__dirname, 'public')));

app.use('/css', express.static(path.join(__dirname, 'node_modules', 'bootstrap', 'dist', 'css')));
app.use('/fonts', express.static(path.join(__dirname, 'node_modules', 'bootstrap', 'dist', 'fonts')));
app.use('/js', express.static(path.join(__dirname, 'node_modules', 'bootstrap', 'dist', 'js')));

app.use('/js', express.static(path.join(__dirname, 'node_modules', 'jquery', 'dist')));

app.set('views', path.join('./', 'src', 'views'));

app.set('view engine', 'ejs');

// defino la configuracion de nav que le voy a pasar el router
const nav = [
  { link: '/books', title: 'Books' },
  { link: '/auth/profile', title: 'Profile' },
];

// importo el modulo con el las rutas de los libros y paso nav como parmetro
// ya que bookRouter.js devuelve una funcion que esopera un argumento
const bookRouter = require('./src/routes/bookRouter')(nav);

app.use(nav[0].link, bookRouter);

/* es solo para cargar datos en mongodb
const adminRouter = require('./src/routes/adminRouter')();

app.use('/admin', adminRouter);
*/

const authRouter = require('./src/routes/authRouter')(nav);

app.use('/auth', authRouter);

app.get('/', (req, res) => {
  // si un usuario se registro local strategy agrego user a req
  // si es asi no muestra la pagina signin signup
  if (req.user) {
    res.redirect(nav[0].link);
  } else {
    res.render(
      'index',
      {
        nav,
        title: 'Welcome to Library'
      }
    );
  }
});

const port = process.env.PORT || 3000;

app.listen(port, () => debug(`Server runinig at port ${chalk.green(port)}`));
