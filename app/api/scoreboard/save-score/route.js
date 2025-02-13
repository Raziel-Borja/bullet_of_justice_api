import { connectDB } from "@/utils/db";
import Scoreboard from "@/models/Scoreboard";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    await connectDB();
    const { username, score } = await req.json();

    if (!username || score === undefined) {
      return NextResponse.json({ error: "Faltan datos" }, { status: 400 });
    }

    const newScore = new Scoreboard({ username, score });
    await newScore.save();

    return NextResponse.json({ message: "Puntuación guardada correctamente" }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
