const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
    company: {
        type: String,
        required: [true, 'Please provide a company name'],
        maxLength: 50,
        trim: true
    },
    position: {
        type: String,
        required: [true, 'Please provide a postion'],
        maxLength: 100,
        trim: true
    },
    status: {
        type: String,
        enum: ['interview', 'declined', 'pending'],
        default: 'pending'
    },
    createdBy: {
        type: mongoose.Types.ObjectId,
        ref: 'User',
        required: [true, 'Please provide an user']
    },
    jobType: {
        type: String,
        enum: ['full-time', 'part-time', 'remote', 'internship'],
        default: 'full-time'
    },
    jobLocation: {
        type: String,
        default: 'My city',
        required: true
    }
}, { timestamps: true });

const Job = mongoose.model('Job', jobSchema);
module.exports = Job;