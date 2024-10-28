import { connect } from "@/dbConfig/dbConfig";
import User from "@/models/userModel";
import bcryptjs from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";
import randomstring from "randomstring";

connect();

function generateOTP() {
  return randomstring.generate({
    length: 4,
    charset: "numeric",
  });
}

export async function POST(request: NextRequest) {
  try {
    const reqBody = await request.json();
    const { username, email } = reqBody.user;

    const otp = generateOTP();

    const existingUser = await User.findOne({ email: email });

    if (existingUser) {
      return NextResponse.json(
        { error: "User already exists" },
        { status: 400 }
      );
    }
    const accesstoken = await bcryptjs.hash(email, 10);

    const newUser = new User({
      username: username,
      email: email,
      otp: otp,
      OTPexpiry: new Date(Date.now() + 60000),
      accesstoken: accesstoken,
    });

    const savedUser = await newUser.save();

    return NextResponse.json(
      { message: "User created successfully", user: savedUser._id },
      { status: 201 }
    );
  } catch (error) {
    console.log("Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
