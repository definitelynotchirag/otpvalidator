import User from "@/models/userModel";
import { NextResponse, NextRequest } from "next/server";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";

export async function POST(req: NextRequest) {
  try {
    const { otp, userId } = await req.json();

    const user = await User.findById(userId);
    if (!user) {
      throw new Error("User not found");
    }

    let isValid = false;

    if (user.otp === otp) {
      isValid = true;
    }


    if (!isValid) {
      return NextResponse.json(
        { message: "Invalid OTP", valid: false },
        { status: 400 }
      );
    }

    if (user.OTPexpiry < Date.now()) {
      return NextResponse.json(
        { message: "OTP Expired", valid: false },
        { status: 400 }
      );
    }
    
    const updatedUser = await User.findByIdAndUpdate(userId, {
      isVerified: true,
      otp: null,
      OTPexpiry: null,
    });
    
    const tokendata = {
      id: user._id,
      email: user.email,
      username: user.username,
    };

    const token = jwt.sign(tokendata, process.env.TOKEN_SECRET!, {
      expiresIn: "24h",
    });
    
    const response = NextResponse.json(
      { message: "OTP is valid Login successful", token },
      { status: 200 }
    );

    response.cookies.set("token", token, {
      httpOnly: true,
      sameSite:true,
    });

    return response;
    
  } catch (error) {
    console.error("Error validating OTP:", error);
    return NextResponse.json(
      { message: "Server error", valid: false },
      { status: 500 }
    );
  }
}
