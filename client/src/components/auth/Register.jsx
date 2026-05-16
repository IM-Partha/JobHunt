import React, { useState } from "react";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { Apiurl } from "@/urls/Apiurl";
import { toast } from "sonner";
import { useDispatch, useSelector } from "react-redux";
import { Loader2 } from "lucide-react";
import { setLoading } from "@/redux/authSlice";

const Register = () => {
  const navigate = useNavigate()
    const dispatch = useDispatch()
   const {loading} = useSelector(store=>store.auth)
  const [info, setInfo] = useState({
    fullname: "",
    email: "",
    phoneNumber: "",
    password: "",
    role: "student",
    file: null,
  });

  function handleChange(e) {
    const { name, value, type, files } = e.target;

    setInfo((prev) => ({
      ...prev,
      [name]: type === "file" ? files[0] : value,
    }));
  }

async function handleSubmit(e) {
  e.preventDefault();

  try {
    dispatch(setLoading(true))
    const formData = new FormData();
    for (const key in info) {
      formData.append(key, info[key]);
      
    }
    console.log(formData)
    const res = await axios.post(`${Apiurl}/register`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    if(res.data.success){
      toast.success(res.data.message)
      navigate('/verify-email', { state: { email: info.email } })
    }
  } catch (error) {
    toast.error(error.response.data.message)
  }finally{
     dispatch(setLoading(false))
  }
}


  return (
    <section className="flex items-center justify-center max-w-7xl mx-auto px-4">
      <form
        className="w-full md:w-1/2 border border-gray-200 rounded-md p-6 my-10 shadow-sm"
        method="POST"
        onSubmit={handleSubmit}
      >
        <h1 className="font-bold text-2xl mb-6 text-gray-800 text-center">
          Sign Up
        </h1>

        {/* Full Name */}
        <div className="mb-4">
          <Label htmlFor="fullname">Full Name</Label>
          <Input
            id="fullname"
            name="fullname"
            type="text"
            placeholder="Full name"
            className="mt-2"
            value={info.fullname}
            onChange={handleChange}
          />
        </div>

        {/* Email */}
        <div className="mb-4">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="Email"
            className="mt-2"
            value={info.email}
            onChange={handleChange}
          />
        </div>

        {/* Phone */}
        <div className="mb-4">
          <Label htmlFor="phoneNumber">Phone Number</Label>
          <Input
            id="phoneNumber"
            name="phoneNumber"
            type="text"
            placeholder="Phone number"
            className="mt-2"
            value={info.phoneNumber}
            onChange={handleChange}
          />
        </div>

        {/* Password */}
        <div className="mb-4">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            name="password"
            type="password"
            placeholder="Password"
            className="mt-2"
            value={info.password}
            onChange={handleChange}
          />
        </div>

        {/* Role Radio Buttons */}
        <div className="mb-4 flex items-center gap-6">
          <div className="flex items-center gap-2">
            <input
              type="radio"
              id="student"
              name="role"
              value="student"
              checked={info.role === "student"}
              onChange={handleChange}
              className="cursor-pointer"
            />
            <Label htmlFor="student">Student</Label>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="radio"
              id="recruiter"
              name="role"
              value="recruiter"
              checked={info.role === "recruiter"}
              onChange={handleChange}
              className="cursor-pointer"
            />
            <Label htmlFor="recruiter">Recruiter</Label>
          </div>
        </div>

        {/* Profile Image */}
        <div className="mb-4 w-60 flex items-center gap-2">
          <Label htmlFor="file">Profile</Label>
          <Input
            id="file"
            name="file"
            type="file"
            accept="image/*"
            className="cursor-pointer"
            onChange={handleChange}
          />
        </div>

        {/* Submit Button */}
        <div className="flex flex-col gap-3">
          {
            loading ?
            <Button><Loader2 className="w-full  text-white cursor-pointer animate-spin  " />  Please wait</Button>
          :
          <Button
            type="submit"
            className="w-full  text-white cursor-pointer"
          >
            Register
          </Button>
          }
          
          <span>
            Already have an account?{" "}
            <Link to="/login" className="text-blue-600">
              Login
            </Link>
          </span>
        </div>
      </form>
    </section>
  );
};

export default Register;
