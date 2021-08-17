import DBInterface from "../database/DBInterface";

export default async function getRandomUsersHandler(req, res) {
  let db;
  try {
    db = await DBInterface.getDB();
    const searchParams = new URL(req.url, `https://${req.headers.host}`)
      .searchParams;
    const sampleSize = +searchParams.get("sample_size");
    const userId = searchParams.get("user_id");

    const result = await db.getRandomUsers(sampleSize, userId);
    res.status(200).json({ result });
  } catch (error) {
    res.status(504).json({
      error: error.message,
    });
  }
}
