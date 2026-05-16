import React, { useEffect, useState } from "react";
import { Badge } from "./badge";
import { Button } from "./button";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { Apiapplication, ApiJob } from "@/urls/Apiurl";
import { setSinglejob } from "@/redux/jobSlice";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";

const Descriptiopage = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((store) => store.auth);
  const { singlejob } = useSelector((store) => store.job);
  const params = useParams();
  const navigate = useNavigate();
  const jobId = params.id;

  const [isApplied, setIsApplied] = useState(false);

  // ✅ Fetch job details
  useEffect(() => {
    const fetchAllJobs = async () => {
      try {
        const res = await axios.get(`${ApiJob}/get/${jobId}`, {
          withCredentials: true,
        });
        if (res.data.success) {
          dispatch(setSinglejob(res.data.job));
          setIsApplied(
            res.data.job.applications.some(
              (app) => app.applicant === user?._id
            )
          );
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchAllJobs();
  }, [jobId, dispatch]);

  // ✅ Apply Job
  const applyJobHandler = async () => {
    if (!user) {
      toast.error("Please login to apply for this job");
      navigate("/login");
      return;
    }
    
    try {
      const res = await axios.get(`${Apiapplication}/apply/${jobId}`, {
        withCredentials: true,
      });
      if (res.data.success) {
        setIsApplied(true);
        const updatedSingleJob = {
          ...singlejob,
          applications: [
            ...(singlejob.applications || []),
            { applicant: user?._id },
          ],
        };
        dispatch(setSinglejob(updatedSingleJob));
        toast.success(res.data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
      console.log(error);
    }
  };

  return (
    <div className="max-w-7xl px-10 my-10">
      <h1 className="font-bold text-xl">{singlejob?.title}</h1>
      <div className="flex justify-between items-center">
        <div>
          <div className="flex flex-wrap gap-2 mt-4">
            <Badge className="text-blue-700 font-semibold" variant="ghost">
              {singlejob?.position}
            </Badge>
            <Badge className="text-[#F83002] font-semibold" variant="ghost">
              {singlejob?.jobType}
            </Badge>
            <Badge className="text-[#7209b7] font-semibold" variant="ghost">
              {singlejob?.salary}
            </Badge>
          </div>
        </div>
        <Button
          onClick={!isApplied ? applyJobHandler : null}
          disabled={isApplied}
          className={`rounded-lg ${
            isApplied
              ? "bg-gray-700 cursor-not-allowed"
              : "bg-[#7209b7] hover:bg-[#5f32ad]"
          }`}
        >
          {isApplied ? "Already Applied" : "Apply Now"}
        </Button>
      </div>

      <div>
        <h1 className="border-b-2 border-b-gray-300 font-medium py-4">
          {singlejob?.description}
        </h1>
      </div>

      <div className="my-4">
        <h1 className="font-bold my-1">
          Role:{" "}
          <span className="pl-4 font-normal text-gray-800">
            {singlejob?.title}
          </span>
        </h1>
        <h1 className="font-bold my-1">
          Location:{" "}
          <span className="pl-4 font-normal text-gray-800">
            {singlejob?.location}
          </span>
        </h1>
        <h1 className="font-bold my-1">
          Description:{" "}
          <span className="pl-4 font-normal text-gray-800">
            {singlejob?.description}
          </span>
        </h1>
        <h1 className="font-bold my-1">
          Experience:{" "}
          <span className="pl-4 font-normal text-gray-800">
            {singlejob?.experienceLevel} yrs
          </span>
        </h1>
        <h1 className="font-bold my-1">
          Salary:{" "}
          <span className="pl-4 font-normal text-gray-800">
            {singlejob?.salary} LPA
          </span>
        </h1>
        <h1 className="font-bold my-1">
          Total Applicants:{" "}
          <span className="pl-4 font-normal text-gray-800">
            {singlejob?.applications?.length || 0}
          </span>
        </h1>
        <h1 className="font-bold my-1">
          Posted Date:{" "}
          <span className="pl-4 font-normal text-gray-800">
            {singlejob?.createdAt
              ? singlejob.createdAt.split("T")[0]
              : "N/A"}
          </span>
        </h1>
      </div>
    </div>
  );
};

export default Descriptiopage;
