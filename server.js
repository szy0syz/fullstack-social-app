require('dotenv').config({ path: './config.env' });
const app = require('express')();
const server = require('http').Server(app);
const connectDB = require('./utilsServer/connectDb');
const PORT = process.env.PORT || 3000;

const next = require('next');
const dev = process.env.NODE_ENV !== 'production';
const nextApp = next({ dev });
const handle = nextApp.getRequestHandler();

connectDB();

nextApp.prepare().then(() => {
  app.use('/api/signup', require('./api/signup'));
  app.use('/api/auth', require('./api/auth'));

  app.all('*', (req, res) => handle(req, res));

  server.listen(PORT, (err) => {
    if (err) throw err;
    console.log(`Server running on ${PORT}`);
  });
});
