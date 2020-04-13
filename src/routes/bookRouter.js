// debo importar aca tabien exporess
const express = require('express');
// hago toda la ruta de los libros por separado y luego la inyecto al principal
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

// defino un ruta de bookRouter y su accion, la raiz sera con lo que defini el uso de bookRouter
// osea aqui la accion se va a dar en el url /books/
bookRouter.route('/')
  .get((req, res) => {
    res.render(
      'books', {
        nav: [{
          link: '/books',
          title: 'Books'
        },
        {
          link: '/authors',
          title: 'Authors'
        }
        ],
        books,
        title: 'Library'
      }
    );
  });
// defino un ruta de bookRouter y su accion, la raiz sera con lo que defini el uso de bookRouter
// osea aqui la accionb se va a dar en el url /books/single
bookRouter.route('/single')
  .get((req, res) => {
    res.send('single book section :) <a href="/">Returno to main</a>');
  });

module.exports = bookRouter;
