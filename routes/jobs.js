const router = require("express").Router();
const {getAllJobs,getJob,createJob,updateJob,deleteJob} = require("../controllers/jobs");




router.route("/").get(getAllJobs).post(createJob);

router.route("/:id").get(getJob).patch(updateJob).delete(deleteJob);
// here patch is used instead of put because we are not updating the whole job. We are just updating the company and position fields of the job.
// but if we were updating the whole job then we would have used put. Whole job means all the fields of the job.
// put --> updates the whole job
// patch --> updates only the fields sent by the user in the request body. 


module.exports = router;
