import React from "react";
import { Button } from "./ui/button";
import { Bookmark } from "lucide-react";
import { Avatar, AvatarImage } from "./ui/avatar";
import { Badge } from "./ui/badge";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { toast } from "sonner";
import { Apiurl } from "@/urls/Apiurl";
import { updateUserSavedJobs } from "@/redux/authSlice";
const Job = ({ job }) => {
  const navigate = useNavigate();
  const daysAgoFound = (mongodbTime) => {
    if (!mongodbTime) return null;
    const createdAt = new Date(mongodbTime);
    if (isNaN(createdAt)) return null;
    const current = new Date();
    const timeDiff = current - createdAt;
    return Math.floor(timeDiff / (1000 * 60 * 60 * 24));
  };

  const dispatch = useDispatch();
  const { user } = useSelector((store) => store.auth);
  const isSaved = user?.profile?.savedJobs?.includes(job?._id);

  const handleSaveJob = async () => {
    if (!user) {
      toast.error("Please login to save a job");
      return;
    }
    try {
      const res = await axios.post(`${Apiurl}/save-job/${job?._id}`, {}, {
        withCredentials: true,
      });
      if (res.data.success) {
        dispatch(updateUserSavedJobs(res.data.savedJobs));
        toast.success(res.data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "An error occurred");
    }
  };

  return (
    <section className="p-4 border rounded-lg shadow-sm w-full max-w-md">
      {/* Header section */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-600">
          {daysAgoFound(job?.createdAt) === 0
            ? "Today"
            : `${daysAgoFound(job?.createdAt)} days ago`}
        </p>

        <Button variant="outline" className={`rounded-full ${isSaved ? 'bg-gray-100' : ''}`} size="icon" onClick={handleSaveJob}>
          <Bookmark className={`w-4 h-4 cursor-pointer ${isSaved ? 'fill-[#7209b7] text-[#7209b7]' : ''}`} />
        </Button>
      </div>

      {/* Company section */}
      <div className="flex items-center gap-3 mt-4">
        <Avatar>
          <AvatarImage src={job?.company?.logo} alt="Company Logo" />
        </Avatar>

        <div>
          <h1 className="font-semibold text-lg">{job?.company?.name}</h1>
          <p className="text-sm text-gray-500">India</p>
        </div>
      </div>
      <div className="">
        <h1 className="font-bold text-lg my-2">{job?.title}</h1>
        <p className="text-sm text-gray-600">{job?.description}</p>
      </div>
      <div className="flex items-center gap-2 mt-4">
        <Badge className="text-blue-700 font-bold" variant="ghost">
          {job?.position}
        </Badge>
        <Badge className="text-[#F83002] font-bold" variant="ghost">
          {job?.jobType}
        </Badge>
        <Badge className="text-[#7209b7] font-bold" variant="ghost">
          {job?.salary}
        </Badge>
      </div>
      <div className="flex items-center gap-4 mt-4">
        <Button
          variant="outline"
          onClick={() => navigate(`/detail/${job?._id}`)}
          className="cursor-pointer"
        >
          Details
        </Button>
        <Button 
          className={`cursor-pointer ${isSaved ? 'bg-gray-600' : 'bg-[#7209b7]'}`} 
          onClick={handleSaveJob}
        >
          {isSaved ? "Saved" : "Save for Later"}
        </Button>
      </div>
    </section>
  );
};

export default Job;
