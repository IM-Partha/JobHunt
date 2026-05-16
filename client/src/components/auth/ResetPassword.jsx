import React, { useState } from "react";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "sonner";
import axios from "axios";
import { Apiurl } from "@/urls/Apiurl";
import { Loader2 } from "lucide-react";

const ResetPassword = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const [info, setInfo] = useState({
    code: "",
    newPassword: "",
  });
  const email = location.state?.email || "";

  function handleChange(e) {
    const { name, value } = e.target;
    setInfo((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!email) {
      toast.error("Email is missing. Please request a new code.");
      navigate("/forgot-password");
      return;
    }

    try {
      setLoading(true);
      const res = await axios.post(`${Apiurl}/reset-password`, { 
        email, 
        code: info.code, 
        newPassword: info.newPassword 
      }, {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      });

      if (res.data.success) {
        toast.success(res.data.message);
        navigate("/login");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to reset password");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="flex items-center justify-center max-w-7xl mx-auto px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full md:w-1/2 border border-gray-200 rounded-md p-6 my-10 shadow-sm"
      >
        <h1 className="font-bold text-2xl mb-2 text-gray-800 text-center">
          Reset Password
        </h1>
        <p className="text-center text-gray-500 mb-6">
          Enter the 6-digit code sent to {email || "your email"} and your new password.
        </p>

        <div className="mb-4">
          <Label htmlFor="code">Reset Code</Label>
          <Input
            onChange={handleChange}
            name="code"
            value={info.code}
            id="code"
            type="text"
            placeholder="Enter 6-digit code"
            className="mt-2"
            required
          />
        </div>

        <div className="mb-6">
          <Label htmlFor="newPassword">New Password</Label>
          <Input
            onChange={handleChange}
            name="newPassword"
            value={info.newPassword}
            id="newPassword"
            type="password"
            placeholder="Enter new password"
            className="mt-2"
            required
          />
        </div>

        <div className="flex flex-col gap-3">
          {loading ? (
            <Button disabled>
              <Loader2 className="w-full text-white animate-spin" />
              Resetting
            </Button>
          ) : (
            <Button type="submit" className="w-full text-white cursor-pointer">
              Reset Password
            </Button>
          )}
        </div>
      </form>
    </section>
  );
};

export default ResetPassword;
