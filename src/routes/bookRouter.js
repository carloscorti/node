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
    .get((req, res) => {
      (async (conf) => {
        const { id } = req.params;
        const db = new Database(conf);
        try {
          const book = await db.query('SELECT * FROM `book` WHERE `id` = ? LIMIT 1', [`${id}`]);
          res.render(
            'bookView', {
              nav,
              book: book[0],
              title: 'Library',
            }
          );
        } catch (err) {
          debug(`There was an error :( ${err}`);
        } finally {
          await db.close();
        }
      })(config);
    });

  return bookRouter;
}

// el modulo exporta la funcion que devuelve el router
module.exports = router;
