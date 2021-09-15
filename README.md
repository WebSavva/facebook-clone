# Facebook clone
The given app represents a partial Facebook clone. The [following tutorial](https://www.youtube.com/watch?v=dBotWYKYYWc) served as an inspiration for that. As I was developing it, I got the feeling that some functionality is missing in the original version of the app. Eventually I decided to add a bit more complexity by bringing new technologies and tools. The final version of the app highly resembles the real Facebook website. 

### Technologies and tools used in the project:
* Next.js
* Mongo.db - Atlass MongoDB
>It's worth noting that at the beginning I planned to use Sqlite3 database due to its simplicity. But by the time I made a first release on Heroku, I found out that Heroku does not persist data and files created in the runtime. In other words, in such conditions, built-in database could not be preserved. Hence, there was a need to decouple app and database servers.
* Cloudinary
>In order to store media files uploaded by users, instead of using heavy Firebase.
* NextAuth.js
>Authentication of users implemented via VK api. Initially, Facebook API was used. However, soon afterwards I discovered that the email address of those users, who registered their profile on mobile devices, is not provided by Facebook API. As a result, VK API was picked out since it is more reliable in terms of data provision.
* Multer
>Library that allows to read uploaded files on the server side.
* Socket.io
>To notify users about newly published posts in real time.

### Features
* Custom hooks were applied in those cases where the logic could be shared between components, e.g. sending HTTP-requests. To back that up with a real example, "usePostsLoader" hook allows to load posts on demand as the user scrolls down the feed.
* Users can publish posts with media files(video,music and images) attached to them. Every user is allowed to upload a file the size of which does not exceed the 20MB limit. In addition to that, the maximal size of the memory allocated for a single user equals to 80MB. 
* It is also possible to find out which users are online. Status is updated with a help of Beacon API. 
* In order to avoid unnecessary HTTP-requests, Context API is used to store all user's fetched posts. 
* The sidebar on the right, which lists some online users, is updated every 5 minutes. 
* Uploaded image preview like in VK
* Website design is fully responsive


