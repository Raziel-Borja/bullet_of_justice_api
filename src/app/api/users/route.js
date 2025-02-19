import connectDB from "@/../lib/mongodb";
import User from "@/../models/User";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

// 📌 Función para agregar encabezados CORS
function withCORS(response) {
  response.headers.set("Access-Control-Allow-Origin", "*");
  response.headers.set("Access-Control-Allow-Methods", "GET, POST, PUT, OPTIONS");
  response.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization");
  return response;
}

// 📌 Manejo de solicitudes OPTIONS (preflight)
export function OPTIONS() {
  return withCORS(new NextResponse(null, { status: 204 }));
}

// 📌 Registro de usuario (POST)
export async function POST(req) {
  try {
    await connectDB();
    const { gamertag, email, password } = await req.json();

    // 📌 Validar datos
    if (!gamertag || !email || !password) {
      return withCORS(NextResponse.json({ error: "Todos los campos son obligatorios" }, { status: 400 }));
    }

    // 📌 Verificar si el usuario ya existe
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return withCORS(NextResponse.json({ error: "El usuario ya existe" }, { status: 400 }));
    }

    // 📌 Encriptar contraseña antes de guardar
    const hashedPassword = await bcrypt.hash(password, 10);

    // 📌 Crear usuario
    const newUser = new User({ gamertag, email, password: hashedPassword });
    await newUser.save();

    return withCORS(NextResponse.json({ message: "Usuario creado exitosamente" }, { status: 201 }));
  } catch (error) {
    console.error("🔥 Error en POST /api/register:", error);
    return withCORS(NextResponse.json({ error: "Error al registrar usuario" }, { status: 500 }));
  }
}

// 📌 Obtener usuarios (GET)
export async function GET(req) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const email = searchParams.get("email");

    let users;
    if (email) {
      users = await User.findOne({ email });
      if (!users) return withCORS(NextResponse.json({ error: "Usuario no encontrado" }, { status: 404 }));
    } else {
      users = await User.find();
    }

    return withCORS(NextResponse.json(users, { status: 200 }));
  } catch (error) {
    return withCORS(NextResponse.json({ error: "Error al obtener usuarios" }, { status: 500 }));
  }
}

// 📌 Actualizar puntajes del usuario (PUT)
export async function PUT(req) {
  try {
    await connectDB();
    const { email, kills, civiliansRescued, points } = await req.json();

    const user = await User.findOne({ email });
    if (!user) {
      return withCORS(NextResponse.json({ error: "Usuario no encontrado" }, { status: 404 }));
    }

    user.scores.kills += kills || 0;
    user.scores.civiliansRescued += civiliansRescued || 0;
    user.scores.points += points || 0;
    await user.save();

    return withCORS(NextResponse.json(user, { status: 200 }));
  } catch (error) {
    return withCORS(NextResponse.json({ error: "Error al actualizar puntajes" }, { status: 500 }));
  }
}
