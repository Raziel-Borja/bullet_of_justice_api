import connectDB from "@/../lib/mongodb";
import User from "@/../models/User";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

// 📌 Endpoint para autenticar al usuario
export async function POST(req) {
  try {
    await connectDB();
    const { email, password } = await req.json();

    // 📌 Buscar al usuario por email
    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json({ error: "Usuario no encontrado" }, { status: 404 });
    }

    // 📌 Comparar la contraseña ingresada con la almacenada
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return NextResponse.json({ error: "Contraseña incorrecta" }, { status: 401 });
    }

    // 📌 Si todo es correcto, devolver una respuesta exitosa
    return NextResponse.json({ message: "Autenticación exitosa", user }, { status: 200 });
  } catch (error) {
    console.error("🔥 Error en POST /api/login:", error);
    return NextResponse.json({ error: "Error al autenticar usuario" }, { status: 500 });
  }
}