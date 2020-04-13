const express = require('express');
const chalk = require('chalk');
const debug = require('debug')('app');
const morgan = require('morgan');
const path = require('path');

const app = express();

app.use(morgan('tiny'));

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
  { link: '/authors', title: 'Authors' }
];

// importo el modulo con el las rutas de los libros y paso nav como parmetro
// ya que bookRouter.js devuelve una funcion que esopera un argumento
const bookRouter = require('./src/routes/bookRouter')(nav);

app.use(nav[0].link, bookRouter);

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
