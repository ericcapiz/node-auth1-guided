const express = require("express");
const session = require("express-session") //npm i express-session
const KnexSessionStore = require('connect-session-knex')(session);
const helmet = require("helmet");
const cors = require("cors");

const usersRouter = require("../users/users-router.js");
const authRouter = require('../auth/auth-router');
const server = express();

server.use(helmet());
server.use(express.json());
server.use(cors());

const sessionConfig = {
  name: 'sksession',
  secret: 'keep it dark',
  cookie:{
    maxAge: 3600 * 1000, // 1000miliseconds * 3600 seconds = 1 hour
    secure: false,
    httpOnly: true,
  },
  resave:false,
  saveUninitialized: false,

  store: new KnexSessionStore({
    knex: require('../database/connection'),
    tablename:'sessions',
    sidfieldname:'sid',
    createtable:true,
    clearInterval: 3600 * 1000
  })
}

server.use(session(sessionConfig))
server.use('/api/auth', authRouter)
server.use("/api/users", usersRouter);

server.get("/", (req, res) => {
  res.json({ api: "up" });
});

module.exports = server;
