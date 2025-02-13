import { connectDB } from "@/utils/db";
import Scoreboard from "@/models/Scoreboard";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await connectDB();
    const scores = await Scoreboard.find().sort({ score: -1 }).limit(10); // Top 10 puntuaciones
    return NextResponse.json(scores, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
