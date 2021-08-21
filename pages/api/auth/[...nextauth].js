import NextAuth from "next-auth";
import Providers from "next-auth/providers";
import DBInterface from "./../../../database/DBInterface";
import hashify from "./../../../utilities/hash-function";

export default NextAuth({
  providers: [
    Providers.Facebook({
      clientId: process.env.FACEBOOK_CLIENT_ID,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
    }),
  ],
  pages: {
    signIn: "/auth/signin",
    signOut: "/auth/signout",
  },
  callbacks: {
    session: async function (session) {
      const db = await DBInterface.getDB();
      const emailHash = hashify(session.user.email);
      const avatarId = hashify(session.user.image);

      try {
        const currentUser = await db.handleUserEnter({
          userName: session.user.name,
          userId: emailHash,
          avatarId,
          avatarUrl: session.user.image,
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
