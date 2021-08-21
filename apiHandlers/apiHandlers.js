import DBInterface from "../database/DBInterface";
import getSearchParams from "../utilities/getSearchParams";

function generateApiHandler({ paramNames, dbMethod }) {
  return async function (req, res) {
    let db;
    try {
      db = await DBInterface.getDB();
      const searchParams = getSearchParams(req, paramNames);
      const result = await db[dbMethod](searchParams);
      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({
        error: error.message,
      });
    } finally {
      if (db) db.close();
    }
  };
}

export const getUserHandler = generateApiHandler({
    paramNames: ['user_id'],
    dbMethod: 'getUserData'
});

export const getUsersHandler = generateApiHandler({
    paramNames: ['self_id', 'entered_name', 'online'],
    dbMethod: 'getUsersData'
});

export const getPostsHandler = generateApiHandler({
    paramNames: ['self_id', 'last_post_id', 'post_owner', 'limit'],
    dbMethod: 'getPosts'
});

export const updateUserOnlineStatus = generateApiHandler({
  paramNames: ['user_id', 'online'],
  dbMethod: 'toggleOnlineStatus'
});