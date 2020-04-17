const express = require('express');
// const mysql = require('mysql');
const debug = require('debug')('app:bookRouter');

const config = {
  host: 'localhost',
  database: 'pslibrary',
  user: 'nodelibrary',
  password: 'nodelibrary'
};

const Database = require('./mysqlpromiseconect.js')();

const db = new Database(config);

(async (dbase) => {
  try {
    // const db = new Database(conf);
    await dbase.connect();
    await dbase.close();
  } catch (err) {
    debug(`There was an error :( ${err}`);
  }
})(db);

// async function cnt(dbase) {
//   try {
//     // const db = new Database(conf);
//     await dbase.connect();
//     await dbase.close();
//   } catch (err) {
//     debug(`There was an error :( ${err}`);
//   }
// }
// cnt(db);
// (async () => { await cnt(db); })();

// const db = new Database(config);
// db.connect()
//   .then(() => db.close())
//   .catch((err) => debug(`There was an error :( ${err}`));

function router(nav) {
  const bookRouter = express.Router();

  const books = [{
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

  bookRouter.route('/')
    .get((req, res) => {
      res.render(
        'booksListViews', {
          nav,
          books,
          title: 'Library'
        }
      );
    });

  // routing para cada libro segun id

  bookRouter.route('/:id')
    .get((req, res) => {
      const {
        id
      } = req.params;
      res.render(
        'bookView', {
          nav,
          book: books[id],
          title: 'Library',
        }
      );
    });

  return bookRouter;
}

// el modulo exporta la funcion que devuelve el router
module.exports = router;
