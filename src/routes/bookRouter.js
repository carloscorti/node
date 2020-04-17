const express = require('express');
const debug = require('debug')('app:bookRouter');

function router(nav, config) {
  const Database = require('./mysqlpromiseconect.js')();

  const bookRouter = express.Router();

  bookRouter.route('/')
    .get((req, res) => {
      (async (conf) => {
        const db = new Database(conf);
        try {
          const books = await db.query('SELECT * FROM book');
          res.render(
            'booksListViews', {
              nav,
              books,
              title: 'Library'
            }
          );
        } catch (err) {
          debug(`There was an error :( ${err}`);
        } finally {
          await db.close();
        }
      })(config);
    });

  // routing para cada libro segun id
  bookRouter.route('/:id')
    // uso .all como midleware,
    // en cada llamada dentro de esta ruta se ejecuta la fucion de .all
    // siempre tengo que terminar con next() para que continue el programa
    // si no uso next() queda detenido al final de la funcion y no continua
    .all((req, res, next) => {
      (async (conf) => {
        const { id } = req.params;
        const db = new Database(conf);
        try {
          const book = await db.query('SELECT * FROM `book` WHERE `id` = ? LIMIT 1', [`${id}`]);
          [req.book] = book; // idem a req.book = book[0];
        } catch (err) {
          debug(`There was an error :( ${err}`);
        } finally {
          await db.close();
          next();
        }
      })(config);
    })

    .get((req, res) => {
      res.render(
        'bookView',
        {
          nav,
          book: req.book,
          title: 'Library',
        }
      );
    });

  return bookRouter;
}

// el modulo exporta la funcion que devuelve el router
module.exports = router;
