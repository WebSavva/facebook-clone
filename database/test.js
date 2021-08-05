const DBInterface = require('./DBInterface.js');

const db = new DBInterface();
db.getMultipleUserPosts({postOwner: '709fa1b8d4992b6d98ae2e2f3da0c0cc6372a283', lastPostId: 1e6}).then(console.log);

