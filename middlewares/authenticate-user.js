const jwt = require('jsonwebtoken');
const {UnauthenticatedError} = require('../errors');

const authenticationMiddleware = async (req, res, next) =>{
    // check header
    const authHeader = req.headers.authorization;
    // * basically here we are requesting for the token from the header of the request
    // user should send the token in the header of the request in the format of Bearer <token> every time he/she makes a request to the server

    // here we are checking if the token is present in the header or not and if not present throw an error 
    if(!authHeader || !authHeader.startsWith('Bearer')){
        throw new UnauthenticatedError('Token not found. Authentication failed!');
    }
    
    // if token is present in the header then extract the token from the header
    // we split the authHeader by space and take the second element of the array which is the token 
    const token = authHeader.split(' ')[1];

    // verify the validity of the token sent by the user
    try{
        const payload = jwt.verify(token, process.env.JWT_SECRET);

        // if the token is valid then we will add the user object to the request object so that we can use it in the routes

        // here user object means the user details of the user who is making the request to the server and request object is the object that is passed to the route handler function 

        // since we passed userid and name while signing the token in the user model, we can access those properties from the payload object now

        req.user = {userId:payload.userId, name:payload.name};
        // User's data is saved in the request object so that we can use it in the routes and we can use it to check if the user is authorized to perform a particular action(resource) or not which minimizes the hassle of searching the database again and again for the user's data.
        next();
        // next() is used to move to the next middleware or route handler function 

    }catch(err){
        throw new UnauthenticatedError('Authentication failed!');
    }
}


module.exports = authenticationMiddleware;

