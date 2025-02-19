import connectDB from "@/../lib/mongodb";
import Score from "@/../models/Score";
import { NextResponse } from "next/server";

export async function GET(req, { params }) {
  try {
    await connectDB();
    const { userId } = params;

    const score = await Score.findOne({ userId }).populate("userId", "name email");
    if (!score) {
      return NextResponse.json({ error: "Score no encontrado" }, { status: 404 });
    }

    return NextResponse.json(score, { status: 200 });
  } catch (error) {
    console.error("🔥 Error en GET /api/scores/[userId]:", error);
    return NextResponse.json({ error: "Error al obtener score" }, { status: 500 });
  }
}
