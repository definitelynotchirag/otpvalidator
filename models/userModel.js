import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, "Please provide a username"],
    unique: true,
  },
  email: {
    type: String,
    required: [true, "Please provide an email"],
    unique: true, // optional: regex for basic email validation
  },
  otp: {
    type: String,
    required: [true, "Please provide an OTP"],
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  OTPexpiry: {
    type: Date,
  },
  accesstoken:{
    type: String,
  }
});

// Handle re-compilation issue in development with hot reloading
let User;
if (mongoose.modelNames().includes('users')) {
  User = mongoose.model('users');
} else {
  User = mongoose.model('users', userSchema);
}

export default User;
