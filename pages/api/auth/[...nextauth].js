import NextAuth from "next-auth";
import Providers from "next-auth/providers";
import DBInterface from "./../../../database/DBInterface";
import hashify from "./../../../utilities/hash-function";



export default NextAuth({
  providers: [
    Providers.VK({
      clientId: process.env.VK_CLIENT_ID,
      clientSecret: process.env.VK_SECRET,
      scope: "user_id"
    }),
  ],
  pages: {
    signIn: "/auth/signin",
    signOut: "/auth/signout",
  },
  callbacks: {
    session: async function (session, user) {
      session.user.email = user.sub;
      const db = await DBInterface.getDB();
      const userHashId = hashify(session.user.email);
      const avatarId = hashify(session.user.image);

      try {
        const currentUser = await db.handleUserEnter({
          userName: session.user.name,
          userId: userHashId,
          avatarId,
          avatarUrl: session.user.image,
          vkId: user.sub
        });
        session.user.image = currentUser.avatarUrl;
        session.user.userId = currentUser.userId;
        session.user.registrationDate = new Date(
          currentUser.registrationDate
        ).toISOString();
      } catch (err) {
        console.log(err.message);
      } finally {
        db.close();
      }
      return session;
    },
  },
});
