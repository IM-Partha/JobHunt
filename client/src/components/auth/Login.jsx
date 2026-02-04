import React, { useState } from "react";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import axios from "axios";
import { Apiurl } from "@/urls/Apiurl";
import { useDispatch, useSelector } from "react-redux";
import { setAuthUser, setLoading } from "@/redux/authSlice";
import { Loader2 } from "lucide-react";

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading } = useSelector((store) => store.auth);
  const [info, setInfo] = useState({
    email: "",
    password: "",
    role: "student",
  });
  function HandelChange(e) {
    const { name, value } = e.target;
    setInfo((pre) => ({
      ...pre,
      [name]: value,
    }));
  }
  async function HandelSubmit(e) {
    e.preventDefault();

    try {
      dispatch(setLoading(true));

      const res = await axios.post(`${Apiurl}/login`, info, {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      });

      if (res.data.success) {
        dispatch(setAuthUser(res.data.user));
        navigate("/");
        toast.success(res.data.message);
      }
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      dispatch(setLoading(false));
    }
  }

  return (
    <section className="flex items-center justify-center max-w-7xl mx-auto px-4">
      <form
        onSubmit={HandelSubmit}
        className="w-full md:w-1/2 border border-gray-200 rounded-md p-6 my-10 shadow-sm"
        method="POST"
      >
        <h1 className="font-bold text-2xl mb-6 text-gray-800 text-center">
          Login
        </h1>

        {/* Email */}
        <div className="mb-4">
          <Label htmlFor="email">Email</Label>
          <Input
            onChange={HandelChange}
            name="email"
            value={info.email}
            id="email"
            type="email"
            placeholder="Email"
            className="mt-2"
          />
        </div>

        {/* Password */}
        <div className="mb-4">
          <Label htmlFor="password">Password</Label>
          <Input
            onChange={HandelChange}
            id="password"
            value={info.password}
            type="password"
            name="password"
            placeholder="Password"
            className="mt-2"
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
              onChange={HandelChange}
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
              onChange={HandelChange}
              className="cursor-pointer"
            />
            <Label htmlFor="recruiter">Recruiter</Label>
          </div>
        </div>

        {/* Profile Image */}

        {/* Submit Button */}
        <div className="flex gap-5 flex-row flex-wrap overflow-hidden">
          {loading ? (
            <Button>
              <Loader2 className="w-full  text-white cursor-pointer animate-spin  " />{" "}
              Please wait
            </Button>
          ) : (
            <Button type="submit" className="w-full  text-white cursor-pointer">
              Login
            </Button>
          )}
          <span>
            don't have an account ?{" "}
            <Link to="/register" className="text-blue-600 mt-5">
              Register
            </Link>
          </span>
        </div>
      </form>
    </section>
  );
};

export default Login;
