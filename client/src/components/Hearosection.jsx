import React, { useState } from "react";
import { Button } from "./ui/button";
import { Search } from "lucide-react";
import { useDispatch } from "react-redux";
import { setsearchquery } from "@/redux/jobSlice";
import { useNavigate } from "react-router-dom";

const Hearosection = () => {
  const [query, setquery] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  function searchHandelar() {
    dispatch(setsearchquery(query));
    navigate("/jobs");
  }
  return (
    <section className="text-center mt-15 px-4">
      <div className="flex flex-col gap-6 items-center">
        {/* Tagline */}
        <span className="px-5 py-2 rounded-full bg-gray-100 text-[#F83002] font-medium text-sm md:text-base">
          No. 1 Job Hunt Website
        </span>

        {/* Heading */}
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight">
          Search, Apply & <br /> Get Your{" "}
          <span className="text-[#6A38C2]">Dream Jobs</span>
        </h1>

        {/* Subtext */}
        <p className="text-gray-600 max-w-xl mx-auto text-sm sm:text-base">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Quis repellat
          cum, obcaecati repudiandae iste praesentium!
        </p>

        {/* Search Bar */}
        <div className="flex w-full max-w-lg shadow-lg border border-gray-200 pl-4 pr-2 rounded-full items-center gap-2 bg-white">
          <input
            onChange={(e) => setquery(e.target.value)}
            className="outline-none py-2 px-2 border-none w-full text-sm sm:text-base"
            type="text"
            placeholder="Find Your Dream Job"
          />
          <Button
            onClick={searchHandelar}
            className="rounded-full px-4 py-2 cursor-pointer"
          >
            <Search className="h-5 w-5 " />
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Hearosection;
