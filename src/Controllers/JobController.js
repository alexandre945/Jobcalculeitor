const Job = require("../model/Job");
const Profile = require("../model/Profile");
const JobUtils = require("../utils/JobUtils");

module.exports = {

    async create (req, res) {
        const profile = await Profile.get();

        return res.render("job", { profile })
    },

    async save (req, res) {

        if (req.body["daily-hours"] > 0) {
            await Job.create({
                name: req.body.name,
                "daily-hours": req.body["daily-hours"],
                "total-hours": req.body["total-hours"],
                created_at: Date.now()
            })
        }
    
        return res.redirect("/");
    },

    async show (req, res) {
        const jobId = await req.params.id;
        const jobs = await Job.get();
        const profile = await Profile.get();

        const job = jobs.find(job => Number(job.id) === Number(jobId));

        if (!job) {
            return res.send("job not found")
        };

        job.budget = JobUtils.calculateBudget(job, profile["value-hour"])        

        return res.render("job-edit", { job, profile: profile });
    },

    async update (req, res) {
        const jobId = req.params.id
        
         const updatedJob = {
            name: req.body.name,
            "total-hours": req.body["total-hours"],
            "daily-hours": req.body["daily-hours"]
        }

        await Job.update(updatedJob, jobId)

        res.redirect('/')
    },

    async delete (req, res) {
        const jobId = req.params.id;

        await Job.delete(jobId);

        return res.redirect("/")
    }
};