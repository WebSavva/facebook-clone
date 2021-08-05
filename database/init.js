const { queries, path: DB_PATH } = require("./server_config.json");
const sqlite3 = require("sqlite3").verbose();

let db = new sqlite3.Database(DB_PATH, (err) => {
  if (err) {
    console.error(err.message);
  }
  console.log("Connected to the fbclone database.");
});


//CREATING TABLES
db.serialize(() => {
  // Queries scheduled here will be serialized.
  db.run(
    queries.CREATE_USERS_TABLE
  )
    .run(queries.CREATE_POSTS_TABLE);
});

db.close((err) => {
  if (err) {
    console.error(err.message);
  }
  console.log("Close the database connection.");
});
