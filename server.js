require("dotenv").config({ path: "./config.env" });
const express = require("express");
const app = express();
const server = require("http").Server(app);
const io = require("socket.io")(server);
const next = require("next");
const dev = process.env.NODE_ENV !== "production";
const nextApp = next({ dev });
const handle = nextApp.getRequestHandler();
const connectDb = require("./utilsServer/connectDb");
const handleSocket = require("./utilsServer/handleSocket");

connectDb();
app.use(express.json());
const PORT = process.env.PORT || 3000;

handleSocket(io);

nextApp.prepare().then(() => {
  app.use("/api/signup", require("./api/signup"));
  app.use("/api/auth", require("./api/auth"));
  app.use("/api/search", require("./api/search"));
  app.use("/api/posts", require("./api/posts"));
  app.use("/api/profile", require("./api/profile"));
  app.use("/api/chats", require("./api/chats"));
  app.use("/api/notifications", require("./api/notifications"));

  app.all("*", (req, res) => handle(req, res));

  server.listen(PORT, (err) => {
    if (err) throw err;
    console.log("Express server running");
  });
});
