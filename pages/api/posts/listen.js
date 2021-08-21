import { Server } from "socket.io";
import DBInterface from "./../../../database/DBInterface";

const ioHandler = async (req, res) => {
  const db = await DBInterface.getDB();
  const postsStream = db.userPosts.watch([
    { $match: { operationType: "insert" } },
  ]);

  
  if (!res.socket.server.io) {
    
    const io = new Server(res.socket.server);

    
    postsStream.on("change", async next => {
      try {
        const newPostData = await db.getPostById(next.documentKey._id);
        io.sockets.emit('new-post', newPostData);

      } catch(error) {
        console.log(error);
      }
    });
    
    io.on('disconnet', () => {
      if (db) db.close();
    });

    res.socket.server.io = io;
  }


  res.end();
};

export const config = {
  api: {
    bodyParser: false,
  },
};

export default ioHandler;
