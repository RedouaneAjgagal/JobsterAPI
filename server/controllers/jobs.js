const Job = require('../models/Job');
const { NotFoundError, BadRequestError } = require('../errors')
const { StatusCodes } = require('http-status-codes')

// route('jobs')
const getAllJobs = async (req, res) => {
    const jobs = await Job.find({ createdBy: req.user.id }, 'company position status');
    res.status(StatusCodes.OK).json(jobs)
}

const createJob = async (req, res) => {
    req.body.createdBy = req.user.id;
    const newPost = await Job.create(req.body);
    res.status(StatusCodes.CREATED).json(newPost);
}


// route('jobs/id')
const getJob = async (req, res) => {
    const jobId = req.params.id;
    const userId = req.user.id;
    const job = await Job.findOne({ _id: jobId, createdBy: userId });
    if (!job) {
        throw new NotFoundError(`Found no job with ID ${jobId}`);
    }
    res.status(StatusCodes.OK).json(job);
}

const updateJob = async (req, res) => {
    const {
        user: { id: userId },
        params: { id: jobId },
        body: { company, position }
    } = req

    if ((!company || company.trim().length < 1) || (!position || position.trim().length < 1)) {
        throw new BadRequestError('Please provide valid values');
    }
    const job = await Job.findOneAndUpdate({ _id: jobId, createdBy: userId }, { company, position }, { new: true, runValidators: true });
    if (!job) {
        throw new NotFoundError(`Found no job with id ${jobId}`);
    }
    res.status(StatusCodes.OK).json(job);
}

const deleteJob = async (req, res) => {
    const {
        user: { id: userId },
        params: { id: jobId }
    } = req
    const job = await Job.findOneAndRemove({ _id: jobId, createdBy: userId });
    if (!job) {
        throw new NotFoundError(`Found no job with id ${jobId}`);
    }
    res.status(StatusCodes.OK).json({msg: `job ID ${jobId} has been deleted successfully`});
}

module.exports = {
    getAllJobs,
    getJob,
    createJob,
    updateJob,
    deleteJob
}