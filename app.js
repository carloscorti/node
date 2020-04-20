const express = require('express');
const chalk = require('chalk');
const debug = require('debug')('app');
const morgan = require('morgan');
const path = require('path');
// para que el body de los post este dentro de la request (req)
const bodyParser = require('body-parser');


const app = express();

app.use(morgan('tiny'));
// uso el bodyParser en la app
// importa el lugar donde lo invoque, no puedo hcerlo despues de los router
// con esto toma el posto y lo pone en request --> req.body
// en req.body esta el post form
// app.use(bodyParser.json()), lo usa como middleware para pasar el body a json
//    -si esta asi app.use(bodyParser.json) va a trabar la aplicacion porque espera next()
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

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
  { link: '/authors', title: 'Authors' },
];

// importo el modulo con el las rutas de los libros y paso nav como parmetro
// ya que bookRouter.js devuelve una funcion que esopera un argumento
const bookRouter = require('./src/routes/bookRouter')(nav);

app.use(nav[0].link, bookRouter);

const adminRouter = require('./src/routes/adminRouter')();

app.use('/admin', adminRouter);

const authRouter = require('./src/routes/authRouter')();

app.use('/auth', authRouter);

app.get('/', (req, res) => {
  res.render(
    'index',
    {
      nav,
      title: 'Library'
    }
  );
});

const port = process.env.PORT || 3000;

app.listen(port, () => debug(`Server runinig at port ${chalk.green(port)}`));
