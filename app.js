require('dotenv').config();
require('express-async-errors');
const express = require("express");
const app = express();

// connectDB
const connectDB = require('./db/connect');

const authenticateUser = require("./middlewares/authenticate-user");

// routers 
const authRouter = require('./routes/auth');
const jobsRouter = require('./routes/jobs');

// error handler 
const notFoundMiddleware = require("./middlewares/not-found");
const errorHandlerMiddleware = require('./middlewares/error-handler');


app.use(express.json());
// extra packages 

//routes
app.use("/api/v1/auth",authRouter);
app.use("/api/v1/jobs",authenticateUser,jobsRouter);
// we passed the authenticateUser middleware to the jobsRouter so that every time a request is made to the jobsRouter, the authenticateUser middleware will be executed first and then the jobsRouter will be executed 
// it works for all the routes(post, get, put, delete) so no need to pass the middleware to each routes separately in the routes file 

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 3000;

const start = async () => {
    try {
        await connectDB(process.env.MONGO_URI)
        app.listen(port, ()=> console.log(`Server is listening on port ${port}...`));
    }catch(err){
        console.log(err);
    }

}

start();
