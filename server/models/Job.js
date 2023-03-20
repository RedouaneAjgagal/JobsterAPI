const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
    company: {
        type: String,
        required: [true, 'Please provide a company name'],
        maxLength: 50
    },
    position: {
        type: String,
        required: [true, 'Please provide a postion'],
        maxLength: 100
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
    }
}, { timestamps: true });

const Job = mongoose.model('Job', jobSchema);
module.exports = Job;