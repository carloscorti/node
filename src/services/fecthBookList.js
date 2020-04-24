/* eslint-disable object-curly-newline */
/* eslint-disable camelcase */
const fetch = require('node-fetch');
const debug = require('debug')('app:fetchBookList');


async function fetchBookList() {
  const bookList = [];
  try {
    const response = await fetch('https://www.etnassoft.com/api/v1/get/?category=cine&criteria=most_viewed');
    const jsonResponse = await response.json();
    jsonResponse.forEach((book) => {
      const { ID, title, author, content_short, content, cover } = book;
      bookList.push({ ID, title, author, content_short, content, cover });
    });
  } catch (err) {
    debug(err.stack);
  }
  return bookList;
}

module.exports = fetchBookList;
