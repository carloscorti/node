const express = require('express');
const { MongoClient } = require('mongodb');
const debug = require('debug')('app:adminRouter');

function router() {
  const adminRouter = express.Router();
  const books = [
    {
      title: 'War and Peace',
      genre: 'Historical Fiction',
      author: 'Lev Tolstoy',
      read: false
    },
    {
      title: 'Les Miserables',
      genre: 'Historical Fiction',
      author: 'Victor Hugo',
      read: false
    },
    {
      title: 'The time Machine',
      genre: 'Science Fiction',
      author: 'H. G. Wells',
      read: true
    },
    {
      title: 'A junrey into the center of the earth',
      genre: 'Science Fiction',
      author: 'Jules Verne',
      read: false
    },
    {
      title: 'The dark world',
      genre: 'Fantasy',
      author: 'Henry Kuttner',
      read: false
    },
    {
      title: 'The wind in the Willows',
      genre: 'Fantasy',
      author: 'Kenneth Grahame',
      read: false
    }
  ];

  adminRouter.route('/')
    .get((req, res) => {
      // url de la base de datos
      const url = 'mongodb://localhost:27017';
      // nombre que va a tener la bd
      const dbName = 'libraryApp';
      (async () => {
        let client;
        try {
          // conecto a la base de datos
          // { useUnifiedTopology: true } es por una advertencia que da node
          client = await MongoClient.connect(url, { useUnifiedTopology: true });
          debug('Server connected');

          // creo la base de datos
          const db = client.db(dbName);
          // creo un "simil tabla" en mongo, una collecion con nombre books
          // con .insertMany(books) inseto datos en la collection
          // al crear la collection e insertar los datos devuelve la misma colection
          // la almaceno en response
          // IMPORTANTE cada vez que se ejecuta .instertMany agrega datos a la collection
          // osea que cada vez que ingrese a /admin agrega datos
          const response = await db.collection('books').insertMany(books);
          // paso response en formato .json como respuesta del get "res"
          res.json(response);
          // debug(response);
        } catch (err) {
          debug(err.stack);
        } finally {
          await client.close();
          debug('Connection closed');
        }
      })();
    });

  return adminRouter;
}

// el modulo exporta la funcion que devuelve el router
module.exports = router;
