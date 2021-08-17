import { isInteger } from 'lodash';
import DBInterface from './../database/DBInterface';
import serverConfig from './../database/server_config.json';
import { NoParamsError } from './custom-errors';

export default async function getPostsHanlder(req, res) {
    let db;
    const searchParams = new URL(req.url, `https://${req.headers.host}`).searchParams;
    const lastPostDateString = searchParams.get(serverConfig.paramNames.lastPostDate);
    const postOwner = searchParams.get(serverConfig.paramNames.postOwner);
    const limitValue = +searchParams.get('limit');
    try {
        db = await DBInterface.getDB();
        if (!lastPostDateString)  throw new NoParamsError();
            console.log(new Date(lastPostDateString));
        const posts = await db.getPosts({upperDate: new Date(lastPostDateString), ...(postOwner && {postOwner}), limitValue});
        res.status(200).json({result: posts});

    } catch (error) {
        res.status(504).json({
            err: error.message
        })
    }
}