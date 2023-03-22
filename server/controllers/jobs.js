const Job = require('../models/Job');
const { NotFoundError, BadRequestError } = require('../errors');
const { StatusCodes } = require('http-status-codes');
const mongoose = require('mongoose');

// route('jobs')
const getAllJobs = async (req, res) => {
    const { search, status, jobType, sort, page: queryPage, limit: queryLimit } = req.query;
    const queryObj = { createdBy: req.user.id };
    // Filter by seaching
    if (search) {
        queryObj.position = { $regex: search, $options: 'i' }
    }
    // Filter by status
    if (status && status !== 'all') {
        queryObj.status = status;
    }
    // Filter by job type
    if (jobType && jobType !== 'all') {
        queryObj.jobType = jobType;
    }

    // sorting
    let sorting = '-createdAt'
    if (sort === 'oldest') {
        sorting = 'createdAt';
    }
    if (sort === 'a-z') {
        sorting = 'position';
    }
    if (sort === 'z-a') {
        sorting = '-position';
    }

    // pagination
    const page = Number(queryPage) || 1;
    const limit = Number(queryLimit) || 10;
    const skip = (page - 1) * limit

    const totalJobs = await Job.countDocuments(queryObj);
    const numOfPages = Math.ceil(totalJobs / limit)

    const jobs = await Job.find(queryObj).sort(sorting).skip(skip).limit(limit);
    res.status(StatusCodes.OK).json({ jobs, totalJobs, numOfPages })
}

const createJob = async (req, res) => {
    req.body.createdBy = req.user.id;
    const newJob = await Job.create(req.body);
    res.status(StatusCodes.CREATED).json(newJob);
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
        body: { company, position, jobLocation, status, jobType }
    } = req

    if ((!company || company.trim().length < 1) || (!position || position.trim().length < 1) || (!jobLocation || jobLocation.trim().length < 1)) {
        throw new BadRequestError('Please provide valid values');
    }
    const job = await Job.findOneAndUpdate({ _id: jobId, createdBy: userId }, { company, position, jobLocation, status, jobType }, { new: true, runValidators: true });
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
    res.status(StatusCodes.OK).json({ msg: `job ID ${jobId} has been deleted successfully` });
}

// route('jobs/stats')
const showStats = async (req, res) => {
    let stats = await Job.aggregate([
        { $match: { createdBy: new mongoose.Types.ObjectId(req.user.id) } },
        { $group: { _id: "$status", count: { $sum: 1 } } }
    ]);

    stats = stats.reduce((acc, curr) => {
        const { _id: title, count } = curr;
        acc[title] = count
        return acc;
    }, {});

    const defaultStats = {
        pending: stats.pending || 0,
        interview: stats.interview || 0,
        declined: stats.declined || 0,
    }

    const getMonthlyApplications = await Job.aggregate([
        {
            $match: { createdBy: new mongoose.Types.ObjectId(req.user.id) }
        },
        {
            $group: {
                _id: { year: { $year: '$createdAt' }, month: { $month: '$createdAt' } },
                count: { $sum: 1 }
            }
        },
        {
            $sort: {
                '_id.year': -1,
                '_id.month': -1
            }
        },
        {
            $limit: 6
        }

    ]);

    const monthlyApplications = getMonthlyApplications.map(item => {
        const { _id: { year, month }, count } = item;
        const date = new Date(year, month - 1).toLocaleTimeString('en-us', { year: 'numeric', month: 'short' }).split(',')[0];

        return { date, count }
    }).reverse()

    res.status(StatusCodes.OK).json({ defaultStats, monthlyApplications });
}

module.exports = {
    getAllJobs,
    getJob,
    createJob,
    updateJob,
    deleteJob,
    showStats
}