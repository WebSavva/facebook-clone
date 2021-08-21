const { MongoClient, ObjectId } = require("mongodb");
const cloudinary = require("./../database/cloudinary").default;
const { FileUploadError } = require("./../apiHandlers/custom-errors");
const serverConfig = require("./server_config.json");


class DBInterface {
  static async getDB(dbConnectionUrl) {
    const dbClient = await MongoClient.connect(process.env.DB_LINK);

    const db = dbClient.db();
    return new this(dbClient, db);
  }
  static usersPostsJoinPipeline = [
    {
      $lookup: {
        from: "users-info",
        localField: "postOwner",
        foreignField: "userId",
        as: "User",
      },
    },
    {
      $unwind: "$User",
    },
    {
      $addFields: {
        postOwnerName: "$User.userName",
        postOwnerAvatarUrl: "$User.avatarUrl",
      },
    },
    {
      $project: {
        postOwnerName: 1,
        postOwner: 1,
        _id: 1,
        publishedDate: 1,
        fileUrl: 1,
        mediaType: 1,
        postOwnerAvatarUrl: 1,
        postText: 1,
      },
    },
  ];

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

  async toggleOnlineStatus({
    userId,
    online
  }) {
    const booleanIsOnline = online == 'true' ? true : false;
    return !!((await this.usersInfo.updateOne(
      {
        userId,
      },
      {
        $set: {
          isOnline: booleanIsOnline,
          ...(!booleanIsOnline && {
            lastSeen: new Date(),
          }),
        },
      }
    )).modifiedCount);
  }

  async getUserData({ userId }) {
    return await this.usersInfo.findOne({
      userId: userId,
    });
  }

  async getUsersData({ selfId, enteredName, online: isOnline }) {
    return await this.usersInfo
      .find({
        userId: {
          $ne: selfId,
        },
        ...(isOnline && {
          isOnline: {
            $eq: !!isOnline,
          },
        }),
        ...(enteredName && {
          userName: { $regex: enteredName, $options: "i" },
        }),
      })
      .toArray();
  }

  async _calculateUserStorageSize({ userId }) {
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

  async handleUserEnter(newUserObject) {
    let currentUser = await this.getUserData({ userId: newUserObject.userId });
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

  async getPostById(id) {
    return await this.userPosts
      .aggregate([
        {
          $match: {
            _id: {
              $eq: id,
            },
          },
        },
        ...DBInterface.usersPostsJoinPipeline,
      ])
      .toArray();
  }

  async getPosts({ lastPostId, postOwner, limit }) {
    let convertedLimit = limit ? +limit : 5;
    if (!postOwner) {
      let queries = [...DBInterface.usersPostsJoinPipeline];
      if (lastPostId) {
        queries = [
          {
            $match: {
              _id: { $lt: ObjectId(lastPostId) },
            },
          },
          ...queries,
        ];
      }
      return await this.userPosts
        .aggregate(queries)
        .sort({ publishedDate: -1 })
        .limit(convertedLimit)
        .toArray();
    }

    return await this.userPosts
      .find({
        ...(lastPostId && {
          _id: {
            $lt: ObjectId(lastPostId),
          },
        }),

        postOwner: postOwner,
      })
      .sort({ publishedDate: -1 })
      .limit(convertedLimit)
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
