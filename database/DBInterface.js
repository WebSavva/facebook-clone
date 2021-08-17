const { MongoClient } = require("mongodb");
const cloudinary = require("./../database/cloudinary").default;
const { FileUploadError } = require("./../apiHandlers/custom-errors");
const serverConfig = require("./server_config.json");

const link = `mongodb+srv://WebSavva:Z0Gn2XbqhDCNZOgW@users.fzsdz.mongodb.net/facebook-clone?retryWrites=true&w=majority`;

class DBInterface {
  static async getDB(dbConnectionUrl) {
    const dbClient = await MongoClient.connect(link);

    const db = dbClient.db();
    return new this(dbClient, db);
  }

  constructor(client, dbConnection) {
    this.client = client;
    this.db = dbConnection;
    this.usersInfo = this.db.collection("users-info");
    this.userPosts = this.db.collection("user-posts");
  }

  async _insertNewUser(newUserObject) {
    const templateNewUserObject = {
      userName: null,
      avatarUrl: null,
      userId: null,
      avatarId: null,
      registrationDate: new Date(),
      lastSeen: new Date(),
    };

    newUserObject.avatarUrl = await this.getCloudAvatarUrl(
      newUserObject.avatarUrl,
      newUserObject.avatarId
    );

    return await this.usersInfo.insertOne({
      ...templateNewUserObject,
      ...newUserObject,
    });
  }
  async updateLastSeen(userId) {
    return await this.usersInfo.updateOne(
      { userId },
      {
        $set: { lastSeen: new Date() },
      }
    );
  }

  async getUserData(id) {
    return await this.usersInfo.findOne({
      userId: id,
    });
  }

  async _calculateUserStorageSize(userId) {
    return await this.userPosts
      .aggregate([
        {
          $match: {
            postOwner: userId,
            fileUrl: { $exists: true },
          },
        },
        {
          $group: {
            _id: null,
            storageSize: { $sum: "$fileSize" },
          },
        },
      ])
      .toArray();
  }
  async getCloudAvatarUrl(rawAvatarUrl, avatarId) {
    console.log("Cloud");
    console.log(cloudinary);
    return await new Promise((res, rej) =>
      cloudinary.uploader.upload(
        rawAvatarUrl,
        {
          public_id: `${serverConfig.cloudFolderName}/${avatarId}`,

          resource_type: "image",
        },
        function (err, result) {
          if (err) {
            rej(new FileUploadError());
            return;
          }

          const { secure_url } = result;
          res(secure_url);
        }
      )
    );
  }

  async updateAvatarUrl({ userId, rawAvatarUrl, avatarId }) {
    const generatedAvatarUrl = await this.getCloudAvatarUrl(
      rawAvatarUrl,
      avatarId
    );
    return await this.usersInfo.updateOne(
      { userId },
      {
        $set: { fileUrl: generatedAvatarUrl, avatarIdentifier: avatarId },
      }
    );
  }

  async createNewUser(newUserObject) {
    let currentUser = await this.getUserData(newUserObject.userId);
    if (!currentUser) {
      await this._insertNewUser(newUserObject);
      currentUser = await this.usersInfo.findOne({
        userId: newUserObject.userId,
      });
    } else {
      if (newUserObject.avatarId !== currentUser.avatarId) {
        await this.updateAvatarUrl({
          rawAvatarUrl: newUserObject.avatarUrl,
          userId: newUserObject.userId,
          avatarId: newUserObject.avatarId,
        });
      }
    }
    return currentUser;
  }

  async getPosts({ upperDate, postOwner, limitValue = 5 }) {
    return await this.userPosts
      .find({
        publishedDate: {
          $lt: upperDate,
        },
        ...(postOwner && {
          postOwner: postOwner,
        }),
      })
      .limit(limitValue)
      .sort({ publishedDate: -1 })
      .toArray();
  }

  async getRandomUsers(size, selfId) {
    return await this.usersInfo
      .aggregate([
        { $sample: { size } },
        {
          $match: {
            userId: {
              $ne: selfId,
            },
          },
        },
      ])
      .toArray();
  }

  async createNewPost(newPostData) {
    const templateNewPostData = {
      postText: null,
      postOwner: null,
      fileUrl: null,
      fileSize: null,
      publishedDate: new Date(),
    };

    const { insertedId } = await this.userPosts.insertOne({
      ...templateNewPostData,
      ...newPostData,
    });

    return await this.userPosts.findOne({ _id: insertedId });
  }

  close() {
    if (this.client) {
      this.client.close();
    }
  }
}

export default DBInterface;
