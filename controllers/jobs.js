const Job = require("../models/Job");
const {StatusCodes} = require("http-status-codes");
const { BadRequestError, NotFoundError } = require("../errors");


const getAllJobs = async (req, res) => {
  const jobs = await Job.find({createdBy: req.user.userId}).sort('createdAt')

  res.status(StatusCodes.OK).json({jobs,count:jobs.length})
};


const getJob = async (req, res) => {
  const {user:{userId}, params:{id:jobId}} = req
    // here we are getting the jobId from the params of the request and the userId from the user object set in the auth middleware.
    // here we could have sent only job id but we also sent the userId so that we can check if the job is created by that same user who is trying to get the job.
    // alternatively we could have done as follows:
    // const userId = req.user.userId
    // const jobId = req.params.id 
    // * but it is not a good practice because we are accessing the properties of req object in two different ways which makes code messy. So we are destructuring the req object in one line itself.

    const job = await Job.findOne({_id:jobId, createdBy:userId})
    if(!job){
        throw new NotFOundError(`No job found with the id ${jobId}`);
    }
    res.status(StatusCodes.OK).json({job});
    // 200 --> OK
};


const createJob = async (req, res) => {
    req.body.createdBy = req.user.userId 
    // req.user is the user object set in the auth middleware. we are setting the createdBy property of the job to the userId of the user who is creating the job.
  const job = await Job.create(req.body)
  // No need to spread the properties of req.body into a new object because we are not using any method of the Job model to create the job. We are just creating the job in the database.
  res.status(StatusCodes.CREATED).json({job});
};


const updateJob = async (req, res) => {
  const {body:{company, position},user:{userId}, params:{id:jobId}} = req

  if(company === '' || position === ''){
    throw new BadRequestError('Company and position fields cannot be empty');
  }
  const job  = await Job.findOneAndUpdate({_id:jobId, createdBy:userId}, req.body, {new:true, runValidators:true})
  // findOneAndUpdate() --> finds the job with the given id and updates it with the data sent by the user in the request body i.e req.body and returns the updated job.
  // new: true --> returns the updated job
  // runValidators: true --> runs the mongoose validators on the updated job
  if(!job){
    throw new NotFoundError (`No job found with the id ${jobId}`);
  }
  res.status(StatusCodes.OK).json({job});

};


const deleteJob = async (req, res) => {
  const {user: { userId },params: { id: jobId }} = req;

  const job = await Job.findOneAndRemove({_id:jobId, createdBy:userId})

  if(!job){
    throw new NotFoundError(`No job with id ${jobId}`);
  }
  res.status(StatusCodes.OK).send();
  // no need to send any data in the response body as we are deleting the job.
};



module.exports = { getAllJobs, getJob, createJob, updateJob, deleteJob };



// VVI Notes: 
// different ways of accessing the properties of req object:

// ? req.body is the object containing the data sent by the user in the request body. req.body is only used in case of POST, PUT and PATCH requests. It is not used in case of GET and DELETE requests. For GET and DELETE requests, we use req.params or req.query.

// * {...req.body} is the object containing the data sent by the user in the request body but it is spread into a new object for the purpose of passing it as a separate argument to the create() method of the User model. We pass as a separate argument because the create() method of the User model is expecting an object as a parameter.

// Create() method in this case expects an argument because it is not an instance method. Rather it is a static method. So we need to pass the object as a separate argument.
// if it were an instance method, we would have done as follows:
// const user = await User.create(req.body)
// Since it is a static method, we should do as follows:
// const user = await User.create({ ...req.body })

// ? req.headers is the object containing the data sent by the user in the request headers.

// ! req.params is the object containing the data sent by the user in the request params or url

// ? req.query is the object containing the data sent by the user in the request query string

// *?  req.user is the object containing the data set by the auth middleware in the request object.