/* eslint-disable no-underscore-dangle */
const { MongoClient } = require('mongodb');
const debug = require('debug')('app:bookShelfController');
const fetchBookList = require('../services/fecthBookList');

function bookShelfController(nav) {
  function getBookAvaiableList(req, res) {
    (async () => {
      try {
        const books = await fetchBookList();
        res.render(
          'bookShelfView', {
            nav,
            books,
            title: 'Library'
          }
        );
      } catch (err) {
        debug(err.stack);
        res.redirect('/auth/profile');
      }
    })();
  }

  function storeSelectedBooks(req, res) {
    const bookToStore = req.body;
    bookToStore.user = req.user._id;

    const url = 'mongodb://localhost:27017';
    const dbName = 'libraryApp';
    (async () => {
      let client;
      try {
        client = await MongoClient.connect(url, { useUnifiedTopology: true });
        debug('Server connected');

        const db = client.db(dbName);

        const col = db.collection('books');


        const existsBook = await col.find({ ID: bookToStore.ID, user: bookToStore.user }).toArray();

        if (existsBook[0]) {
          debug('User already exists');
          res.redirect('/auth/signIn');
        } else {
          await col.insertOne(bookToStore);
          res.redirect('/books');
        }
      } catch (err) {
        debug(err.stack);
      } finally {
        await client.close();
        debug('Connection closed');
      }
    })();
  }

  return {
    getBookAvaiableList,
    storeSelectedBooks,
  };
}

module.exports = bookShelfController;
