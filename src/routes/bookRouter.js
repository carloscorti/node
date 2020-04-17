const express = require('express');
const { MongoClient, ObjectID } = require('mongodb');
const debug = require('debug')('app:bookRouter');

// lo defino como una funcion para configuraciones dinamicas pasando argumentos
function router(nav) {
  const bookRouter = express.Router();

  bookRouter.route('/')
    .get((req, res) => {
      // url de la base de datos
      const url = 'mongodb://localhost:27017';
      // nombre que va a tener la bd
      const dbName = 'libraryApp';
      (async () => {
        // lo declaro aca
        // con let porque si lo hago con const depues no lo puedo asignar
        // fuera del try/catch/finally, si lo hago directamente en connect finally no lo recocnoce
        let client;
        try {
          // conecto a la base de datos
          // { useUnifiedTopology: true } es por una advertencia que da node
          client = await MongoClient.connect(url, { useUnifiedTopology: true });
          debug('Server connected');

          // conecto la base de datos
          const db = client.db(dbName);
          // conecto a la collection donde estan los datos
          const col = await db.collection('books');
          // extraigo de la collection todos los datos en formato array
          // si no lo paso a array me duevueve un objeto mongo con todos los datos
          // con array da solo el resultado en un array
          const books = await col.find().toArray();
          res.render(
            'booksListViews', {
              nav,
              books,
              title: 'Library'
            }
          );
        } catch (err) {
          debug(err.stack);
        } finally {
          await client.close();
          debug('Connection closed');
        }
      })();
    });

  // routing para cada libro segun id

  bookRouter.route('/:id')
    .get((req, res) => {
      const { id } = req.params;
      // url de la base de datos
      const url = 'mongodb://localhost:27017';
      // nombre que va a tener la bd
      const dbName = 'libraryApp';
      (async () => {
        // lo declaro aca
        // con let porque si lo hago con const depues no lo puedo asignar
        // fuera del try/catch/finally, si lo hago directamente en connect finally no lo recocnoce
        let client;
        try {
          // conecto a la base de datos
          // { useUnifiedTopology: true } es por una advertencia que da node
          client = await MongoClient.connect(url, { useUnifiedTopology: true });
          debug('Server connected');

          // conecto la base de datos
          const db = client.db(dbName);
          // conecto a la collection donde estan los datos
          const col = await db.collection('books');
          // extraigo de la collection
          // uso .findOne para que me entregue solo el dato que busco como un object en un array
          // si no lo pongo devuelve un objeto mongo
          // para filtrar _id esta en el objeto buscado
          // lo tengo que buscar como new ObjectID(id) (que lo importe con require)
          // porque _id es de type ObjectID
          const book = await col.findOne({ _id: new ObjectID(id) });
          res.render(
            'bookView', {
              nav,
              book,
              title: 'Library',
            }
          );
        } catch (err) {
          debug(err.stack);
        } finally {
          await client.close();
          debug('Connection closed');
        }
      })();
    });

  return bookRouter;
}

// el modulo exporta la funcion que devuelve el router
module.exports = router;
