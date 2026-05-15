import React, { useEffect, useState } from "react";
import FilterCard from "./Fitercard";
import { useSelector } from "react-redux";
import Job from "./Job";
import { Filter } from "lucide-react";
import { Button } from "./ui/button";

const Jobs = () => {
  const { alljobs, searchquery } = useSelector((store) => store.job);
  const [filyerJobs, setFilterjob] = useState(alljobs);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  useEffect(() => {
    if (searchquery) {
      const filterdJobs = alljobs.filter((job) => {
        return (
          job.title.toLowerCase().includes(searchquery.toLowerCase()) ||
          job.description.toLowerCase().includes(searchquery.toLowerCase()) ||
          job.location.toLowerCase().includes(searchquery.toLowerCase()) ||
          job.salary.toLowerCase().includes(searchquery.toLowerCase())
        );
      });
      setFilterjob(filterdJobs);
    } else {
      setFilterjob(alljobs);
    }
  }, [alljobs, searchquery]);

  return (
    <section className="max-w-7xl mx-auto px-5 mt-10">
      <div className="flex flex-col lg:flex-row gap-8">
        
        {/* Mobile Filter Toggle Button */}
        <div className="lg:hidden flex items-center justify-between">
          <h2 className="text-xl font-bold">Search Results</h2>
          <Button 
            onClick={() => setIsFilterOpen(!isFilterOpen)} 
            variant="outline" 
            className="flex items-center gap-2"
          >
            <Filter className="w-4 h-4" />
            {isFilterOpen ? "Hide Filters" : "Show Filters"}
          </Button>
        </div>

        {/* Sidebar (Filters) */}
        <aside className={`lg:w-1/4 w-full ${isFilterOpen ? "block" : "hidden"} lg:block`}>
          <FilterCard />
        </aside>

        {/* Jobs List */}
        <main className="flex-1">
          {filyerJobs.length <= 0 ? (
            <div className="text-center text-gray-500 py-16 text-lg font-medium">
              No jobs found
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-6 overflow-y-auto max-h-[80vh] pr-2 pb-5">
              {filyerJobs.map((job) => (
                <Job job={job} key={job?._id} />
              ))}
            </div>
          )}
        </main>
      </div>
    </section>
  );
};

export default Jobs;
