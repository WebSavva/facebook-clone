import serverConfig from "./../database/server_config.json";
import fs from "fs";
import path from "path";
import cloudinary from "./../database/cloudinary.js";
import sha1 from "hash.js/lib/hash/sha/1";
import DBInterface from "./../database/DBInterface.js";
import {
  NoDataError,
  FileUploadError,
  StorageLimitError,
} from "./custom-errors.js";

class NewPostHandler {
  constructor() {
    this.savePostHandler = this.savePostHandler.bind(this);
  }

  async savePostHandler(req, res) {
    let db;
    try {
      const { text, ["user-email"]: userEmail } = req.body;

      let newPostData = {};
      newPostData = this.attachPostOwner(newPostData, userEmail);

      db = new DBInterface();

      if (req.file || text) {
        newPostData = this.attachText(newPostData, text);
        let generatedFileUrl = [];
        [newPostData, generatedFileUrl] = await this.attachFile(
          newPostData,
          req.file,
          db
        );

        const newPostObject = await db.createNewPost(newPostData);

        res.status(200).json({
          ...newPostObject,
          ...(generatedFileUrl.length && { fileUrl: generatedFileUrl }),
        });
      } else {
        throw new NoDataError();
      }
    } catch (error) {
      console.log(error.message);
      res.status(504).json({
        err: error.message,
      });
    } finally {
      this.clearOutUploadDirectory();
      if (db) db.shutDown();
    }
  }

  attachPostOwner(newPostData, userEmail) {
    return {
      ...newPostData,
      postOwner: sha1().update(userEmail).digest("hex"),
    };
  }

  attachText(newPostData, text) {
    const newPostDataWithText = { ...newPostData };
    if (text) {
      newPostDataWithText.postText = text;
    }
    return newPostDataWithText;
  }

  async attachFile(newPostData, file, db) {
    const newPostDataWithFile = { ...newPostData };
    let generatedFileUrl = [];
    if (file) {
      //checking size of the file
      const currentUserStorageSize = await db._calculateUserStorageSize([
        newPostDataWithFile.postOwner,
      ]);

      if (currentUserStorageSize + file.size > serverConfig.maxUserStorageSize)
        throw new StorageLimitError();

      const mediaData = file.mimetype.split("/");
      newPostDataWithFile.mediaType = mediaData[0];
      newPostDataWithFile.fileSize = file.size;
      newPostDataWithFile.fileUrl = await new Promise((res, rej) =>
        cloudinary.uploader.upload(
          file.path.replace(/\\/, "/"),
          {
            public_id: `${serverConfig.cloudFolderName}/${sha1()
              .update(file.filename + Date.now() + newPostDataWithFile.postOwner)
              .digest("hex")}`,

            resource_type:
              newPostDataWithFile.mediaType === "audio"
                ? "video"
                : newPostDataWithFile.mediaType,
          },
          function (err, result) {
            if (err) {
              rej(new FileUploadError());
              return;
            }

            const { secure_url } = result;
            const urlMidpoint = Math.floor(secure_url.length / 2);
            generatedFileUrl = [
              secure_url.slice(0, urlMidpoint),
              secure_url.slice(urlMidpoint),
            ];
            res(secure_url);
          }
        )
      );
    }
    return [newPostDataWithFile, generatedFileUrl];
  }

  clearOutUploadDirectory() {
    fs.readdir(serverConfig.mediaPath, (err, files) => {
      if (err) throw new Error(err.message);
      files.forEach((fileName) =>
        fs.unlink(path.join(serverConfig.mediaPath, fileName), (err) => null)
      );
    });
  }
}

export const newPostHandler = new NewPostHandler();
