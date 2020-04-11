const express = require('express');
const chalk = require('chalk');
const debug = require('debug')('app');
const morgan = require('morgan');
const path = require('path');

const app = express();

app.use(morgan('tiny'));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/css', express.static(path.join(__dirname, 'node_modules', 'bootstrap', 'dist', 'css')));
app.use('/js', express.static(path.join(__dirname, 'node_modules', 'bootstrap', 'dist', 'js')));
app.use('/js', express.static(path.join(__dirname, 'node_modules', 'popper.js', 'dist', 'umd')));
app.use('/js', express.static(path.join(__dirname, 'node_modules', 'jquery', 'dist')));

// seteo adonde van a estar las views
app.set('views', path.join('./', 'src', 'views'));

// seteo el view engine
app.set('view engine', 'pug');

app.get('/', (req, res) => {
  res.render('index', { list: ['a', 'b'] });
});

const port = process.env.PORT || 3000;

app.listen(port, () => debug(`Server runinig at port ${chalk.green(port)}`));
