require('dotenv').config();

const Job = require('./models/Job');
const connectDB = require('./db/connect');
const jobs = require('./mock-jobs.json');


const start = async () => {
    try {
        await connectDB(process.env.MONGO_URI);
        await Job.deleteMany({ createdBy: '6418dc3435014ec17eecf76a' })
        await Job.insertMany(jobs);
        console.log('success');
        process.exit(0);
    } catch (error) {
        console.log(error);
        process.exit(1)
    }

}
start();
