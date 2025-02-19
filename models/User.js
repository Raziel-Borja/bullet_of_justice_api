import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const UserSchema = new mongoose.Schema({
  gamertag: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  scores: {
    kills: { type: Number, default: 0 },
    civiliansRescued: { type: Number, default: 0 },
    points: { type: Number, default: 0 }
  }
});

// 📌 Antes de guardar, encriptar la contraseña si ha cambiado
UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

export default mongoose.models.User || mongoose.model("User", UserSchema);
