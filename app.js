const express = require('express');
const chalk = require('chalk');
const debug = require('debug')('app');
const morgan = require('morgan');
const path = require('path');

const app = express();
// creo un router que permite encapsular todos los rutes en un lugar
const bookRouter = express.Router();

app.use(morgan('tiny'));

app.use(express.static(path.join(__dirname, 'public')));

app.use('/css', express.static(path.join(__dirname, 'node_modules', 'bootstrap', 'dist', 'css')));
app.use('/fonts', express.static(path.join(__dirname, 'node_modules', 'bootstrap', 'dist', 'fonts')));
app.use('/js', express.static(path.join(__dirname, 'node_modules', 'bootstrap', 'dist', 'js')));

app.use('/js', express.static(path.join(__dirname, 'node_modules', 'jquery', 'dist')));

app.set('views', path.join('./', 'src', 'views'));

app.set('view engine', 'ejs');

// le digo a la app desde donde voy a usar la ruta del router bookRouter
app.use('/books', bookRouter);
// defino un ruta de bookRouter y su accion, la raiz sera con lo que defini el uso de bookRouter
// osea aqui la accion se va a dar en el url /books/
bookRouter.route('/')
  .get((req, res) => {
    res.send('books section :) <a href="/">Returno to main</a><br><a href="/books/single">Go to Single</a>');
  });
// defino un ruta de bookRouter y su accion, la raiz sera con lo que defini el uso de bookRouter
// osea aqui la accionb se va a dar en el url /books/single
bookRouter.route('/single')
  .get((req, res) => {
    res.send('single book section :) <a href="/">Returno to main</a>');
  });


app.get('/', (req, res) => {
  res.render(
    'index',
    {
      nav: [
        { link: '/books', title: 'Books' },
        { link: '/authors', title: 'Authors' }
      ],
      title: 'Library'
    }
  );
});

const port = process.env.PORT || 3000;

app.listen(port, () => debug(`Server runinig at port ${chalk.green(port)}`));
