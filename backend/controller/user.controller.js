import { User } from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import getDatauri from "../utils/datauri.js";
import cloudinary from "../utils/cloudinary.js";
import { sendEmail } from "../utils/sendEmail.js";

export const Register = async (req, res) => {
  try {
    const { fullname, email, phoneNumber, password, role } = req.body;

    // Validation check
    if (!fullname || !email || !phoneNumber || !password || !role) {
      return res.status(400).json({
        message: "Something is missing",
        success: false,
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        message: "User already exists with this email",
        success: false,
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Optional image upload
    let profilePhotoUrl = ""; // default empty

    if (req.file) {
      const file = req.file;
      const fileuri = getDatauri(file);
      const cloudResponse = await cloudinary.uploader.upload(fileuri.content);
      profilePhotoUrl = cloudResponse.secure_url;
    }

    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString(); // 6 digit code
    const verificationTokenExpiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    // Create new user
    await User.create({
      fullname,
      email,
      phoneNumber,
      password: hashedPassword,
      role,
      profile: {
        profilePhoto: profilePhotoUrl, // could be empty if no upload
      },
      verificationToken: verificationCode,
      verificationTokenExpiresAt,
      isVerified: false
    });

    // Send email
    await sendEmail({
      email,
      subject: "Verify your Email",
      html: `<h2>Welcome to Job Hunt!</h2><p>Your verification code is: <strong style="font-size: 24px;">${verificationCode}</strong></p><p>This code expires in 24 hours.</p>`
    });

    return res.status(201).json({
      message: "User registered successfully. Please check your email for the verification code.",
      success: true,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Server error",
      success: false,
    });
  }
};

export const Login = async (req, res) => {
  try {
    const { email, password, role } = req.body;
    if (!email || !password || !role) {
      return res.status(400).json({
        message: "Something is missing",
        success: false,
      });
    }

    let user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        message: "Incorrect email or password",
        success: false,
      });
    }

    if (!user.isVerified) {
      return res.status(400).json({
        message: "Please verify your email before logging in.",
        success: false,
        notVerified: true
      });
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      return res.status(400).json({
        message: "Incorrect email or password",
        success: false,
      });
    }

    if (role !== user.role) {
      return res.status(400).json({
        message: "Account doesn't exist with current role",
        success: false,
      });
    }

    const tokenData = { userId: user._id };
    const token = jwt.sign(tokenData, process.env.SECRET_KEY, {
      expiresIn: "1d",
    });

    const userData = {
      _id: user._id,
      fullname: user.fullname,
      email: user.email,
      phoneNumber: user.phoneNumber,
      role: user.role,
      profile: user.profile,
    };

    return res
      .status(200)
      .cookie("token", token, {
        httpOnly: true,
        secure: true, // REQUIRED for HTTPS
        sameSite: "none", // REQUIRED for cross-origin
        maxAge: 1 * 24 * 60 * 60 * 1000, // 1 day
      })
      .json({
        message: `Welcome back ${user.fullname}`,
        user: userData,
        success: true,
      });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Server error",
      success: false,
    });
  }
};

export const Logout = async (req, res) => {
  try {
    return res.status(200).cookie("token", "", { maxAge: 0 }).json({
      message: "Log out successfully ",
      success: true,
    });
  } catch (e) {
    console.log(e);
  }
};

export const Updateprofile = async (req, res) => {
  try {
    const { fullname, email, phoneNumber, bio, skills } = req.body;
    const file = req.file;
    const userId = req.id;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized", success: false });
    }

    let skillsArray;
    if (skills) skillsArray = skills.split(",").map((skill) => skill.trim());

    const user = await User.findById(userId);
    if (!user) {
      return res
        .status(400)
        .json({ message: "User not found", success: false });
    }

    // Update fields
    if (fullname) user.fullname = fullname;
    if (email) user.email = email;
    if (phoneNumber) user.phoneNumber = phoneNumber;
    if (bio) user.profile.bio = bio;
    if (skillsArray) user.profile.skills = skillsArray;

    // Upload to cloudinary if file present
    if (file) {
      const fileUri = getDatauri(file);
      const cloudResponse = await cloudinary.uploader.upload(fileUri.content);
      user.profile.resume = cloudResponse.secure_url;
      user.profile.resumeOriginalName = file.originalname;
    }

    await user.save();

    const updatedUser = {
      _id: user._id,
      fullname: user.fullname,
      email: user.email,
      phoneNumber: user.phoneNumber,
      role: user.role,
      profile: user.profile,
    };

    return res.status(200).json({
      message: "Profile updated successfully",
      user: updatedUser,
      success: true,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Server error",
      success: false,
    });
  }
};

export const toggleSaveJob = async (req, res) => {
  try {
    const userId = req.id; // From auth middleware
    const jobId = req.params.id;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized", success: false });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found", success: false });
    }

    const isSaved = user.profile.savedJobs.includes(jobId);

    if (isSaved) {
      // Unsave
      user.profile.savedJobs = user.profile.savedJobs.filter(id => id.toString() !== jobId);
      await user.save();
      return res.status(200).json({
        message: "Job removed from saved list",
        success: true,
        savedJobs: user.profile.savedJobs
      });
    } else {
      // Save
      user.profile.savedJobs.push(jobId);
      await user.save();
      return res.status(200).json({
        message: "Job saved successfully",
        success: true,
        savedJobs: user.profile.savedJobs
      });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Server error",
      success: false,
    });
  }
};

export const VerifyEmail = async (req, res) => {
  try {
    const { email, code } = req.body;
    if (!email || !code) {
      return res.status(400).json({ message: "Email and code are required", success: false });
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User not found", success: false });
    }
    if (user.isVerified) {
      return res.status(400).json({ message: "User already verified", success: false });
    }
    if (user.verificationToken !== code || user.verificationTokenExpiresAt < new Date()) {
      return res.status(400).json({ message: "Invalid or expired verification code", success: false });
    }

    user.isVerified = true;
    user.verificationToken = undefined;
    user.verificationTokenExpiresAt = undefined;
    await user.save();

    return res.status(200).json({ message: "Email verified successfully", success: true });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error", success: false });
  }
};

export const ForgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: "Email is required", success: false });

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "User not found", success: false });

    const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
    user.resetPasswordToken = resetCode;
    user.resetPasswordExpiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 mins
    await user.save();

    await sendEmail({
      email,
      subject: "Password Reset Code",
      html: `<p>Your password reset code is: <strong style="font-size: 24px;">${resetCode}</strong></p><p>This code expires in 15 minutes.</p>`
    });

    return res.status(200).json({ message: "Password reset code sent to your email", success: true });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error", success: false });
  }
};

export const ResetPassword = async (req, res) => {
  try {
    const { email, code, newPassword } = req.body;
    if (!email || !code || !newPassword) return res.status(400).json({ message: "All fields are required", success: false });

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "User not found", success: false });

    if (user.resetPasswordToken !== code || user.resetPasswordExpiresAt < new Date()) {
      return res.status(400).json({ message: "Invalid or expired reset code", success: false });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpiresAt = undefined;
    await user.save();

    return res.status(200).json({ message: "Password reset successfully", success: true });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error", success: false });
  }
};
