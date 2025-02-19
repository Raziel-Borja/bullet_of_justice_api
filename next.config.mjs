/** @type {import('next').NextConfig} */
const nextConfig = {};

export default nextConfig;

const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
  };
  
  export async function POST(req) {
    try {
      await connectDB();
      const { email, password } = await req.json();
  
      const user = await User.findOne({ email });
      if (!user) {
        return new NextResponse(JSON.stringify({ error: "Usuario no encontrado" }), {
          status: 404,
          headers,
        });
      }
  
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return new NextResponse(JSON.stringify({ error: "Contraseña incorrecta" }), {
          status: 401,
          headers,
        });
      }
  
      return new NextResponse(JSON.stringify({ message: "Autenticación exitosa", user }), {
        status: 200,
        headers,
      });
    } catch (error) {
      console.error("🔥 Error en POST /api/login:", error);
      return new NextResponse(JSON.stringify({ error: "Error al autenticar usuario" }), {
        status: 500,
        headers,
      });
    }
  }
