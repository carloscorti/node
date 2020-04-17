const mysql = require('mysql');
const debug = require('debug')('app:mysqlpromiseconect');

function mysqlconnection() {
  return class Database {
    constructor(conf) {
      this.connection = mysql.createConnection(conf);
    }

    connect() {
      return new Promise((resolve, reject) => {
        this.connection.connect((err) => {
          if (err) {
            debug(`error connecting: ${err.stack}`);
            return reject(err);
          }
          debug(`connected as id ${this.connection.threadId}`);
          return resolve();
        });
      });
    }

    query(sql, args) {
      return new Promise((resolve, reject) => {
        this.connection.query(sql, args, (err, rows) => {
          if (err) {
            return reject(err);
          }
          debug('Query succeded');
          debug(`connected as id ${this.connection.threadId}`);
          return resolve(rows);
        });
      });
    }

    close() {
      return new Promise((resolve, reject) => {
        this.connection.end((err) => {
          if (err) {
            return reject(err);
          }
          if (this.connection.state === 'authenticated') {
            debug('Conection closed');
            return resolve();
          }
          return reject(new Error('Error in connection close'));
        });
      });
    }
  };
}

module.exports = mysqlconnection;
