import { NextResponse } from "next/server";
import dbConnect from "@/app/lib/mongoose";
import Dedications from "@/app/models/Dedications";


export async function POST(req) {
    try {
        const {id} = await req.json();
        await dbConnect();
        const dedication = await Dedications.findById(id);
        if (!dedication) {
            return NextResponse.json(
                { message: "Dedication not found" },
                { status: 404 }
            );
        }
        return NextResponse.json(
            { dedication },
            { status: 200 }
        );

    } catch (error) {
        console.error("DB Fetch Error:", error);
        return NextResponse.json(
            { message: "Internal Server Error" },
            { status: 500 }
        );
        
    }
    
}