const express = require('express');
// chalk
// para colorear salidas de consola
// no lo hace cuando ejecuto con nodemon
const chalk = require('chalk');
// debug
// cuando en consola ejecuto DEBUG=* node app.js muestra lo que llama debug(), sino no mestra nada
// con DEBUG=* node app.js muestra todo lo que sale de express tambien, porue usa debug,
// DEBUG=app node app.js solo mostrara los debug() de este archivo
// ya que en require le pase el argumento ('app')
// cpara funcionar con nodemon --> DEBUG=app nodemonn app.js
const debug = require('debug')('app');
// morgan
// para mostrar en consola las llamadas http con sus sontenidos
// funciona con nodemon
const morgan = require('morgan');
// path
// node built-in, sirve para formar paths con nombres
const path = require('path');

const app = express();

// asi seteo para que las llamadas http aparezcan en conbsola
// app.use(morgan('combined'))
app.use(morgan('tiny')); // asi mustra menos informacion, solo el tipo de pedido y es status
// app.use(require('morgan')('combined')) // se puede asi pero queda muy confuso

// para setear el directorio public de archivos estaticos hecho especificios para este proyect
app.use(express.static(path.join(__dirname, 'public')));

// para setear el directorio en donde voy a tener bootstrap instaladocon npm
// si no encuentra archivos en /public/css los busca donde le indico el .use('/css',...)
// si no encuentra archivos en /public/js los busca donde le indico el .use('/js',...)
app.use('/css', express.static(path.join(__dirname, 'node_modules', 'bootstrap', 'dist', 'css')));
app.use('/js', express.static(path.join(__dirname, 'node_modules', 'bootstrap', 'dist', 'js')));

// para setear el directorio en donde voy a tener popper instaladocon npm
// si no encuentra archivos en /public/js los busca donde le indico el .use('/js',...)
app.use('/js', express.static(path.join(__dirname, 'node_modules', 'popper.js', 'dist', 'umd')));

// para setear el directorio en donde voy a tener jQuery instaladocon npm
// si no encuentra archivos en /public/js los busca donde le indico el .use('/js',...)
app.use('/js', express.static(path.join(__dirname, 'node_modules', 'jquery', 'dist')));

app.get('/', (req, res) => {
  // res.send('Hello from my library app :)')// solo muestra en pantalla el mensaje
  // res.sendFile(__dirname + '/views/index.html')
  // envio un html __dirname da un string con el path de la carpeta padre de donde esta este archvo
  res.sendFile(path.join(__dirname, 'views', 'index.html')); // hecho con path
});

// le digo en que puerto va a estar dependiendo si en desarrollo o production
// el de desarrollo lo configure en package.json en la configuracion de nodemon
const port = process.env.PORT || 3000;

app.listen(port, () => debug(`Server runinig at port ${chalk.green(port)}`)); // uso de un debug
