const express = require('express');

// lo defino como una funcion para configuraciones dinamicas pasando argumentos
function router(nav) {
  const bookRouter = express.Router();

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
      const { id } = req.params;
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
