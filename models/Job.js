const mongoose = require("mongoose");

const jobsSchema = new mongoose.Schema({
    company:{
        type: String,
        required: [true, "Please provide company name"],
        maxlength:50,
    },
    position:{
        type: String,
        required: [true, "Please provide position"],
        maxlength:100,
    },
    status:{
        type:String,
        enum: ['interview','declined','pending'],
        default: 'pending',
    },
    createdBy:{
        type: mongoose.Types.ObjectId,
        // this is the id of the user who created the job
        // it is done this way so that we can get the user who created the job
        ref:'User',
        // ref refers to the model name we are referring to
        required: [true, "Please provide user"]
    }

},{timestamps:true});
// timestamps will add createdAt and updatedAt fields to the schema and will automatically update the updatedAt field whenever the document is updated


module.exports = mongoose.model('Job', jobsSchema);