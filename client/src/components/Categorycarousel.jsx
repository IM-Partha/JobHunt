import React from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "./ui/carousel";
import { Button } from "./ui/button";
import { useDispatch } from "react-redux";
import { setsearchquery } from "@/redux/jobSlice";
import { useNavigate } from "react-router-dom";

const category = [
  "Frontend Developer",
  "Backend Developer",
  "Data Science",
  "Graphic Designer",
  "FullStack Developer",
];

const Categorycarousel = () => {
  const dispatch=useDispatch()
  const navigate =useNavigate()
    function searchHandelar(query) {
      dispatch(setsearchquery(query));
      navigate("/jobs");
    }
  return (
    <section className="mt-15 px-4 sm:px-6">
      {/* Heading */}
      <h2 className="text-center text-xl sm:text-2xl font-bold mb-6">
        Explore by <span className="text-[#6A38C2]">Category</span>
      </h2>

      {/* Carousel */}
      <Carousel className="w-full max-w-4xl lg:max-w-5xl mx-auto mt-15">
        <CarouselContent>
          {category.map((item, index) => (
            <CarouselItem
              key={index}
              className="flex justify-center basis-full sm:basis-1/2 lg:basis-1/3 cursor-pointer"
            >
              <Button
              onClick={()=>searchHandelar(item)}
                variant="outline"
                className="rounded-full px-4 sm:px-6 py-2 text-sm sm:text-base transition-all w-[85%] sm:w-auto"
              >
                {item}
              </Button>
            </CarouselItem>
          ))}
        </CarouselContent>

        {/* Controls */}
        <CarouselPrevious className="flex absolute left-2 top-1/2 -translate-y-1/2 z-10" />
        <CarouselNext className="flex absolute right-2 top-1/2 -translate-y-1/2 z-10" />
      </Carousel>
    </section>
  );
};

export default Categorycarousel;
