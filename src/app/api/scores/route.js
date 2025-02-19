import connectDB from "@/../lib/mongodb";
import Score from "@/../models/Score";
import User from "@/../models/User";
import { NextResponse } from "next/server";

/** 📌 POST: Crear o actualizar un score para un usuario **/
export async function POST(req) {
  try {
    await connectDB();
    const { email, kills = 0, civiliansRescued = 0, points = 0 } = await req.json();

    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json({ error: "Usuario no encontrado" }, { status: 404 });
    }

    // 🔹 Buscar si ya existe un score para este usuario
    let score = await Score.findOne({ userId: user._id });

    if (score) {
      // 🔹 Si existe, actualizar los valores
      score.kills += kills;
      score.civiliansRescued += civiliansRescued;
      score.points += points;
    } else {
      // 🔹 Si no existe, crear un nuevo score
      score = new Score({
        userId: user._id,
        kills,
        civiliansRescued,
        points,
      });
    }

    await score.save();
    return NextResponse.json(score, { status: 201 });
  } catch (error) {
    console.error("🔥 Error en POST /api/scores:", error);
    return NextResponse.json({ error: "Error al crear o actualizar score" }, { status: 500 });
  }
}

/** 📌 PUT: Actualizar el score de un usuario **/
export async function PUT(req) {
  try {
    await connectDB();
    const { email, kills = 0, civiliansRescued = 0, points = 0 } = await req.json();

    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json({ error: "Usuario no encontrado" }, { status: 404 });
    }

    const score = await Score.findOne({ userId: user._id });
    if (!score) {
      return NextResponse.json({ error: "Score no encontrado" }, { status: 404 });
    }

    // 🔹 Sumar los nuevos valores
    score.kills += kills;
    score.civiliansRescued += civiliansRescued;
    score.points += points;

    await score.save();
    return NextResponse.json(score, { status: 200 });
  } catch (error) {
    console.error("🔥 Error en PUT /api/scores:", error);
    return NextResponse.json({ error: "Error al actualizar score" }, { status: 500 });
  }
}

/** 📌 GET: Obtener todos los scores ordenados de mayor a menor **/
export async function GET() {
  try {
    await connectDB();
    const scores = await Score.find().sort({ points: -1 }).populate('userId', 'email');
    return NextResponse.json(scores, { status: 200 });
  } catch (error) {
    console.error("🔥 Error en GET /api/scores:", error);
    return NextResponse.json({ error: "Error al obtener scores" }, { status: 500 });
  }
}