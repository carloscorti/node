const { MongoClient, ObjectID } = require('mongodb');
const debug = require('debug')('app:bookController');

function bookController(nav) {
  function getBookList(req, res) {
    const url = 'mongodb://localhost:27017';
    const dbName = 'libraryApp';
    (async () => {
      let client;
      try {
        const { _id } = req.user;

        client = await MongoClient.connect(url, { useUnifiedTopology: true });
        debug('Server connected');

        const db = client.db(dbName);

        const col = db.collection('books');

        const books = await col.find({ user: _id }).toArray();

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
  }

  function getBookById(req, res) {
    const { id } = req.params;
    const url = 'mongodb://localhost:27017';
    const dbName = 'libraryApp';
    (async () => {
      let client;
      try {
        client = await MongoClient.connect(url, { useUnifiedTopology: true });
        debug('Server connected');

        const db = client.db(dbName);

        const col = db.collection('books');

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
        res.status(404).send('Sorry cant find that!<br><a href="/books">go back</a>');
      } finally {
        await client.close();
        debug('Connection closed');
      }
    })();
  }

  return {
    getBookList,
    getBookById,
  };
}

module.exports = bookController;
