import { NextResponse } from "next/server";
import dbConnect from "@/app/lib/mongoose";
import Dedication from "@/app/models/Dedications";

export async function POST(request) {
  try {
    await dbConnect();
    const body = await request.json();
    
    const dedication = await Dedication.create(body);

    return NextResponse.json(
      { message: "Saved successfully", id: dedication._id },
      { status: 201 }
    );
  } catch (error) {
    console.error("DB Save Error:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
