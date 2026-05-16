import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import * as Popover from "@radix-ui/react-popover";
import * as Avatar from "@radix-ui/react-avatar";
import { LogOut, Menu, X, User2Icon } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { Apiurl } from "@/urls/Apiurl";
import { toast } from "sonner";
import { setAuthUser } from "@/redux/authSlice";

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((store) => store.auth);
  const [menuOpen, setMenuOpen] = useState(false);

  async function LogoutHandle() {
    try {
      const res = await axios.get(`${Apiurl}/logout`, {
        withCredentials: true,
      });
      if (res.data.success) {
        dispatch(setAuthUser(null));
        navigate("/");
        toast.success(res.data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Logout failed");
    }
  }

  return (
    <div className="bg-white shadow-md sticky top-0 z-50">
      <div className="flex items-center justify-between mx-auto max-w-7xl h-16 px-6">
        {/* Logo */}
        <div>
          <h1 className="text-2xl font-bold">
            Job <span className="text-[#F83002]">Hunt</span>
          </h1>
        </div>

        {/* Hamburger (Mobile) */}
        <div className="md:hidden">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="focus:outline-none"
          >
            {menuOpen ? <X size={26} /> : <Menu size={26} />}
          </button>
        </div>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-6">
          <ul className="flex font-medium items-center gap-5">
            {user && user.role === "recruiter" ? (
              <>
                <li>
                  <Link
                    to="/admin/companies"
                    className="hover:text-[#F83002] transition"
                  >
                    Companies
                  </Link>
                </li>
                <li>
                  <Link
                    to="/admin/jobs"
                    className="hover:text-[#F83002] transition"
                  >
                    Jobs
                  </Link>
                </li>
              </>
            ) : (
              <>
                <li>
                  <Link to="/" className="hover:text-[#F83002] transition">
                    Home
                  </Link>
                </li>
                <li>
                  <Link to="/jobs" className="hover:text-[#F83002] transition">
                    Jobs
                  </Link>
                </li>
                <li>
                  <Link
                    to="/browse"
                    className="hover:text-[#F83002] transition"
                  >
                    Browse
                  </Link>
                </li>
              </>
            )}
          </ul>

          {/* Avatar Popover or Buttons */}
          {!user ? (
            <div className="flex gap-3">
              <Link to="/login">
                <Button variant="outline" className="cursor-pointer">
                  Login
                </Button>
              </Link>

              <Link to="/register">
                <Button className="bg-[#6A38C2] hover:bg-[#5b30a6] text-white cursor-pointer">
                  Sign Up
                </Button>
              </Link>
            </div>
          ) : (
            <Popover.Root>
              <Popover.Trigger asChild>
                <Avatar.Root className="w-10 h-10 rounded-full overflow-hidden cursor-pointer border hover:scale-105 transition">
                  <Avatar.Image
                    src={user?.profile?.profilePhoto}
                    alt="User"
                    className="w-full h-full object-cover"
                  />
                  <Avatar.Fallback className="flex items-center justify-center bg-gray-200 text-gray-600 font-semibold">
                    U
                  </Avatar.Fallback>
                </Avatar.Root>
              </Popover.Trigger>

              <Popover.Portal>
                <Popover.Content
                  align="end"
                  sideOffset={8}
                  className="bg-white border rounded-lg shadow-md p-4 w-48"
                >
                  <p className="font-medium mb-3 text-gray-700">
                    {user.fullname}
                  </p>

                  <div className="flex flex-col gap-2 items-start text-left">
                    {user.role === "student" && (
                      <Button
                        variant="link"
                        className="cursor-pointer w-full justify-start px-0"
                        asChild
                      >
                        <Link
                          to="/profile"
                          className="flex items-center gap-2 text-left"
                        >
                          <User2Icon size={18} /> View Profile
                        </Link>
                      </Button>
                    )}

                    <Button
                      variant="link"
                      onClick={LogoutHandle}
                      className="cursor-pointer w-full justify-start px-0 flex items-center gap-2 text-left"
                    >
                      <LogOut size={18} /> Logout
                    </Button>
                  </div>

                  <Popover.Arrow className="fill-white" />
                </Popover.Content>
              </Popover.Portal>
            </Popover.Root>
          )}
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-white border-t shadow-inner px-6 pb-4">
          <ul className="flex flex-col font-medium gap-4 mt-3">
            {user && user.role === "recruiter" ? (
              <>
                <li>
                  <Link
                    to="/admin/companies"
                    className="hover:text-[#F83002] transition"
                    onClick={() => setMenuOpen(false)}
                  >
                    Companies
                  </Link>
                </li>
                <li>
                  <Link
                    to="/admin/jobs"
                    className="hover:text-[#F83002] transition"
                    onClick={() => setMenuOpen(false)}
                  >
                    Jobs
                  </Link>
                </li>
              </>
            ) : (
              <>
                <li>
                  <Link
                    to="/"
                    className="hover:text-[#F83002] transition"
                    onClick={() => setMenuOpen(false)}
                  >
                    Home
                  </Link>
                </li>
                <li>
                  <Link
                    to="/jobs"
                    className="hover:text-[#F83002] transition"
                    onClick={() => setMenuOpen(false)}
                  >
                    Jobs
                  </Link>
                </li>
                <li>
                  <Link
                    to="/browse"
                    className="hover:text-[#F83002] transition"
                    onClick={() => setMenuOpen(false)}
                  >
                    Browse
                  </Link>
                </li>
              </>
            )}

            {!user ? (
              <div className="flex flex-col gap-3 mt-3">
                <Link to="/login" onClick={() => setMenuOpen(false)}>
                  <Button variant="outline" className="w-full">
                    Login
                  </Button>
                </Link>
                <Link to="/register" onClick={() => setMenuOpen(false)}>
                  <Button className="bg-[#6A38C2] hover:bg-[#5b30a6] text-white w-full">
                    Sign Up
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="flex flex-col gap-3 mt-3 items-start text-left">
                {user.role === "student" && (
                  <Link
                    to="/profile"
                    onClick={() => setMenuOpen(false)}
                    className="w-full"
                  >
                    <Button
                      variant="link"
                      className="w-full justify-start flex items-center gap-2 px-0"
                    >
                      <User2Icon size={18} /> View Profile
                    </Button>
                  </Link>
                )}
                <Button
                  variant="link"
                  onClick={() => {
                    setMenuOpen(false);
                    LogoutHandle();
                  }}
                  className="w-full justify-start flex items-center gap-2 px-0"
                >
                  <LogOut size={18} /> Logout
                </Button>
              </div>
            )}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Navbar;
