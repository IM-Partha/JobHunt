import React, { useState } from "react";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import axios from "axios";
import { Apiurl } from "@/urls/Apiurl";
import { Loader2 } from "lucide-react";

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      setLoading(true);
      const res = await axios.post(`${Apiurl}/forgot-password`, { email }, {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      });

      if (res.data.success) {
        toast.success(res.data.message);
        navigate("/reset-password", { state: { email } });
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to send reset code");
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
          Forgot Password
        </h1>
        <p className="text-center text-gray-500 mb-6">
          Enter your email to receive a password reset code.
        </p>

        <div className="mb-4">
          <Label htmlFor="email">Email</Label>
          <Input
            onChange={(e) => setEmail(e.target.value)}
            name="email"
            value={email}
            id="email"
            type="email"
            placeholder="Enter your email"
            className="mt-2"
            required
          />
        </div>

        <div className="flex flex-col gap-3">
          {loading ? (
            <Button disabled>
              <Loader2 className="w-full text-white animate-spin" />
              Sending Code
            </Button>
          ) : (
            <Button type="submit" className="w-full text-white cursor-pointer">
              Send Reset Code
            </Button>
          )}
        </div>
      </form>
    </section>
  );
};

export default ForgotPassword;
