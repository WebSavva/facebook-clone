import nextConnect from "next-connect";
import multer from "multer";
import { newPostHandler } from "./../../apiHandlers/NewPostHandler.js";
import serverConfig from './../../database/server_config.json';

const upload = multer({
  storage: multer.diskStorage({
    destination: serverConfig.mediaPath,
    filename: (req, file, cb) => cb(null, file.originalname),
  }),
});

const apiRoute = nextConnect({
  onError(error, req, res) {
    res
      .status(501)
      .json({ error: `Sorry something Happened! ${error.message}` });
  },
  onNoMatch(req, res) {
    res.status(405).json({ error: `Method '${req.method}' Not Allowed` });
  },
});

apiRoute.use(upload.single(serverConfig.inputNames.fileInputName));

apiRoute.post(newPostHandler.savePostHandler);

export default apiRoute;

export const config = {
  api: {
    bodyParser: false
  },
};
