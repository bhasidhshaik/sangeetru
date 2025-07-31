import dbConnect from "@/app/lib/mongoose";
import Dedication from "@/app/models/Dedications";
import { NextResponse } from "next/server";

export async function GET(request) {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) {
        return NextResponse.json({ error: "Missing id" }, { status: 400 });
    }
    try {
        await dbConnect();
        const dedications = await Dedication.find({ userId: id }).sort({ timestamp: -1 });
        if (dedications.length === 0) {
            return NextResponse.json({ error: "No dedications found for this user" }, { status: 404 });
        }
        return NextResponse.json({ dedications }, { status: 200 });
        } catch (error) {
            console.error(error);
            return NextResponse.json({ error: "Failed to fetch dedications" }, { status:
500 });
            }
            










}