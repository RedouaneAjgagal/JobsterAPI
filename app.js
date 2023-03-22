require('dotenv').config();
require('express-async-errors');


const express = require('express');
const app = express();
const connectDB = require('./db/connect');
const jobsRouter = require('./routes/jobs');
const authRouter = require('./routes/auth');
const authUser = require('./middleware/authentication');

const path = require('path')

// extra security packages
const helmet = require('helmet');
const xssCleaner = require('xss-clean');

// error handler
const notFoundMiddleware = require('./middleware/not-found');
const errorHandlerMiddleware = require('./middleware/error-handler');

app.set('trust proxy', 1);
app.use(express.static(path.resolve(__dirname, './client/build')));
app.use(express.json());
app.use(helmet());
app.use(xssCleaner());

// routes
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/jobs', authUser, jobsRouter);

app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, './client/build', 'index.html'));
});

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 5000;

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    app.listen(port, () =>
      console.log(`Server is listening on port ${port}...`)
    );
  } catch (error) {
    console.log(error);
  }
};

start();
