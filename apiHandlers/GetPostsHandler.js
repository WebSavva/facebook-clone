import { isInteger } from 'lodash';
import DBInterface from './../database/DBInterface';
import serverConfig from './../database/server_config.json';
import { NoParamsError } from './custom-errors';

export default async function getPostsHanlder(req, res) {
    let db;
    const searchParams = new URL(req.url, `https://${req.headers.host}`).searchParams;
    const lastPostId = +searchParams.get(serverConfig.paramNames.lastPostId);
    const postOwner = searchParams.get(serverConfig.paramNames.postOwner);
    try {
        db = new DBInterface();
        if (!isInteger(lastPostId) || !postOwner)  throw new NoParamsError();
            
        const rows = await db.getMultipleUserPosts({postOwner, lastPostId});
        res.status(200).json({rows});
    } catch (error) {
        res.status(504).json({
            err: error.message
        })
    }
}