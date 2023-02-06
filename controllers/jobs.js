const Job = require("../models/Job");
const {StatusCodes} = require("http-status-codes");
const { BadRequestError, NotFoundError } = require("../errors");


const getAllJobs = async (req, res) => {
  res.send("get all jobs");
};

const getJob = async (req, res) => {
  res.json("get job")
};

const createJob = async (req, res) => {
    req.body.createdBy = req.user.userId 
    // req.user is the user object set in the auth middleware. we are setting the createdBy property of the job to the userId of the user who is creating the job.
  const job = await Job.create(req.body)
  // No need to spread the properties of req.body into a new object because we are not using any method of the Job model to create the job. We are just creating the job in the database.
  res.status(StatusCodes.CREATED).json({job});
};

const updateJob = async (req, res) => {
  res.send("update job");
};

const deleteJob = async (req, res) => {
  res.send("delete job");
};


module.exports = { getAllJobs, getJob, createJob, updateJob, deleteJob };

