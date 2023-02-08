require('dotenv').config();
require('express-async-errors');
const express = require("express");
const app = express();

// extra security packages 
const helmet = require("helmet");
// helmet is used to set security HTTP headers to prevent attacks such as cross-site scripting (XSS) and clickjacking. Http headers are the metadata that is sent along with the request and response.
const cors = require("cors");
// cors is used to enable cross-origin resource sharing. It is used to allow requests from different origins and domains to access the resources of the server.
const xss = require("xss-clean");
// xss-clean is used to prevent cross-site scripting (XSS) attacks. 
const rateLimiter = require("express-rate-limit");
// express-rate-limit is used to limit repeated requests to public APIs and/or endpoints.

// connectDB
const connectDB = require('./db/connect');

const authenticateUser = require("./middlewares/authenticate-user");

// routers 
const authRouter = require('./routes/auth');
const jobsRouter = require('./routes/jobs');

// error handler 
const notFoundMiddleware = require("./middlewares/not-found");
const errorHandlerMiddleware = require('./middlewares/error-handler');


app.set('trust proxy', 1) // trust first proxy i.e it means that we are trusting the first proxy that is the nginx server and not the express server since we are hosting it on the nginx server in heroku 

app.use(rateLimiter({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100 // limit each IP to 100 requests per windowMs
    // here windowMs is the time period in which the requests are limited and max is the number of requests that can be made in that time period 
    // we did this to prevent brute force attacks and to prevent the server from being overloaded by unwanted requests
    // we placed it before the express.json() middleware because we want to limit the requests before the body parser parses the body of the request
})) 

app.use(express.json());
// extra packages 
app.use(helmet());
app.use(cors());
app.use(xss());

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
