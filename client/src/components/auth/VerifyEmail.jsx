import React, { useState } from "react";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "sonner";
import axios from "axios";
import { Apiurl } from "@/urls/Apiurl";
import { Loader2 } from "lucide-react";

const VerifyEmail = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const [code, setCode] = useState("");
  const email = location.state?.email || "";

  async function handleSubmit(e) {
    e.preventDefault();
    if (!email) {
      toast.error("Email is missing. Please register or login again.");
      return;
    }

    try {
      setLoading(true);
      const res = await axios.post(`${Apiurl}/verify-email`, { email, code }, {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      });

      if (res.data.success) {
        toast.success(res.data.message);
        navigate("/login");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Verification failed");
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
          Verify Your Email
        </h1>
        <p className="text-center text-gray-500 mb-6">
          We've sent a 6-digit verification code to {email || "your email"}.
        </p>

        <div className="mb-4">
          <Label htmlFor="code">Verification Code</Label>
          <Input
            onChange={(e) => setCode(e.target.value)}
            name="code"
            value={code}
            id="code"
            type="text"
            placeholder="Enter 6-digit code"
            className="mt-2"
            required
          />
        </div>

        <div className="flex flex-col gap-3">
          {loading ? (
            <Button disabled>
              <Loader2 className="w-full text-white animate-spin" />
              Verifying
            </Button>
          ) : (
            <Button type="submit" className="w-full text-white cursor-pointer">
              Verify Email
            </Button>
          )}
        </div>
      </form>
    </section>
  );
};

export default VerifyEmail;
