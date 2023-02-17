const dotenv = require('dotenv');
const mongoose = require('mongoose');

// process.on('uncaughtException', err => {
//   console.log('UNCAUGHT EXCEPTION! 💥 Shutting down...');
//   console.log(err.name, err.message);
//   process.exit(1);
// });
const app = require('./app');

dotenv.config({
  path: './config.env'
});

const db = process.env.MONGO_URI.replace(
  '<PASSWORD>',
  process.env.MONGO_PASSWORD
);
mongoose
  .connect(db, {
    useNewUrlParser: true
  })
  .then(() => {
    console.log('DB connection successful');
  });

const server = app.listen(process.env.PORT, () => {
  console.log(`Server up and running on port ${process.env.PORT}`);
});
