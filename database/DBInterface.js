const { async } = require("regenerator-runtime");
const fs = require("fs");
const {
  queries,
  dbPath: DB_PATH,
  maxUserStorageSize,
} = require("./server_config.json");
const sqlite3 = require("sqlite3");
sqlite3.verbose();

function databasePromisifyGenerator(db, queriesObject) {
  return function (queryName, method, callback) {
    return async function (params) {
      return new Promise((res, rej) => {
        db[method](queriesObject[queryName], params, function (err, ...args) {
          if (err) rej(err);

          const statementObject = this;
          res(callback(...args, statementObject));
        });
      });
    };
  };
}

class FbDatabaseInterface {
  static async initializeDB() {
    let db = new sqlite3.Database(DB_PATH);
    try {
      let initializedUsers = await new Promise((res, rej) => {
        db.run(
          queries.CREATE_USERS_TABLE,
          (db, err) => {
            if (err) {
              rej (new Error('Users table has not been initialized'));
              return;
            }
            res(true);
          }
        );
      });
      let initializedPosts = await new Promise( (res, rej) => {db.run(queries.CREATE_POSTS_TABLE, (db, err) => {
        if (err) {
          rej(new Error('Posts table has not been initialized'));
          return;
        }
  
        res(true);
      })});

      return true;

    } catch (error) {

      return false;
    } finally {
      db.close();
    }
   
  }
  constructor() {
    this.db = new sqlite3.Database(DB_PATH);

    const dbPromisifyGenerator = databasePromisifyGenerator(this.db, queries);

    this.checkUserExistence = dbPromisifyGenerator(
      "CHECK_USER_EXISTENCE_QUERY",
      "get",
      (row) => !!Object.values(row)[0]
    );
    this._insertNewUser = dbPromisifyGenerator(
      "INSERT_USER_QUERY",
      "run",
      () => true
    );
    this._getAllUsers = dbPromisifyGenerator(
      "SELECT_ALL_USERS_QUERY",
      "all",
      (rows) => rows.map((row) => [row.email, row.lastSeen])
    );
    this._insertNewPostWithoutFile = dbPromisifyGenerator(
      "INSERT_POST_WITHOUT_FILE_QUERY",
      "run",
      (...args) => args[args.length - 1].lastID
    );
    this._insertNewPostWithFile = dbPromisifyGenerator(
      "INSERT_POST_WITH_FILE_QUERY",
      "run",
      (...args) => args[args.length - 1].lastID
    );
    this._insertNewFullPost = dbPromisifyGenerator(
      "INSERT_FULL_POST_QUERY",
      "run",
      (...args) => args[args.length - 1].lastID
    );
    this._calculateUserStorageSize = dbPromisifyGenerator(
      "CALCULATE_ALL_USER_POSTS",
      "get",
      (result) => Object.values(result)[0]
    );
    this._getPostData = dbPromisifyGenerator(
      "SELECT_POST_QUERY",
      "get",
      (row) => {
        console.log(row);
        return row;
      }
    );
    this._getAllPosts = dbPromisifyGenerator(
      "SELECT_ALL_POSTS_QUERY",
      "all",
      (rows) => rows
    );
    this.getAllUserPosts = dbPromisifyGenerator(
      "SELECT_ALL_POSTS_BY_USER_QUERY",
      "all",
      (rows) => rows
    );
    this.getNumberUserPosts = dbPromisifyGenerator(
      "COUNT_ALL_USER_POSTS",
      "get",
      (row) => Object.values(row)[0]
    );
    this._getLimitedUserPosts = dbPromisifyGenerator(
      "SELECT_MULTIPLE_USER_POSTS",
      "all",
      (rows) => rows
    );
  }

  async createNewUser(email) {
    try {
      let doesUserExist = await this.checkUserExistence([email]);

      if (doesUserExist)
        throw new Error(`The user with email ${email} already exists`);

      let createdStatus = await this._insertNewUser([email]);

      return createdStatus;
    } catch {
      return false;
    }
  }

  async createNewPost(postFields) {
    const numberFields = Object.values(postFields).length;
    const { postText, postOwner, fileUrl, fileSize, mediaType } = postFields;

    let doesUserExist = await this.checkUserExistence(postOwner);

    if (!doesUserExist)
      throw new Error(`The user with email ${postOwner} does not exist`);

    let method, newPostValues;
    switch (true) {
      case numberFields === 2:
        method = "_insertNewPostWithoutFile";
        newPostValues = [postOwner, postText];
        break;
      case numberFields === 4:
        method = "_insertNewPostWithFile";
        newPostValues = [postOwner, fileUrl, fileSize, mediaType];
        break;
      default:
        method = "_insertNewFullPost";
        newPostValues = [postOwner, postText, fileUrl, fileSize, mediaType];
        break;
    }
    let newPostId = await this[method](newPostValues);

    if (!newPostId) throw new Error("Post has not been created");

    let newPostData = await this._getPostData([newPostId]);

    return newPostData;
  }

  async getMultipleUserPosts({ postOwner, lastPostId }) {
    console.log(postOwner, lastPostId);
    return await this._getLimitedUserPosts([lastPostId, postOwner]);
  }

  shutDown() {
    this.db.close();
  }
}

module.exports = FbDatabaseInterface;
