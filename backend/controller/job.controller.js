import { Job } from "../models/job.model.js"


export const postJob = async (req, res) => {
    try {
        const { title, description, requirements, salary, location, jobType, experience, position, companyId } = req.body;
        
        const userId = req.id;
        
        if (!title || !description || !requirements || !location || !jobType || !experience || !companyId || salary === "" || salary === undefined || position === "" || position === undefined) {
            return res.status(400).json({
                message: "Something is missing. Please fill all fields.",
                success: false
            });
        }

        const job = await Job.create({
            title,
            description,
            requirements: requirements.split(","),
            salary: Number(salary) || 0,
            location,
            jobType,
            experienceLevel: experience,
            position: Number(position) || 0,
            company: companyId,
            created_by: userId
        });

        return res.status(201).json({
            message: "New Job Created successfully",
            job,
            success: true
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Internal server error.",
            success: false,
            error: error.message
        });
    }
}


export const getAlljob = async (req,res)=>{
    try {
        const keyword = req.query.keyword || ""
    const query={
        $or:[
            {title:{$regex:keyword, $options:"i"}},
            {description:{$regex:keyword, $options:"i"}}
        ]
    }
    const jobs = await Job.find(query).populate({
        path:"company"
    }).sort({createdAt:-1})
    if(!jobs){
        return res.status(404).json({
            message:"Job not found",
            success:false
        })
    }
    return res.status(200).json({
        jobs,
        success:true
    })
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Internal server error.",
            success: false,
            error: error.message
        });
    }
}


export const getJobById= async(req,res)=>{
    try {
        let jobId =  req.params.id
        let job = await Job.findById(jobId).populate({
            path:"applications"
        })
        if(!job){
            return res.status(404).json({
                message:"Jobs not found",
                success:false
            })
        }
        return res.status(200).json({
            job, 
            success:true
        })
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Internal server error.",
            success: false,
            error: error.message
        });
    }
}


export const getAdminJob = async (req,res)=>{
    try {
    const adminId  =  req.id 
    const jobs = await Job.find({created_by: adminId}).populate({
        path:"company",
        createdAt:-1
    })
    if(!jobs){
        return res.status(404).json({
            message:"jobs not found",
            success:false
        })
    }
    return res.status(200).json({
        jobs,
        success:true
    })
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Internal server error.",
            success: false,
            error: error.message
        });
    }
}