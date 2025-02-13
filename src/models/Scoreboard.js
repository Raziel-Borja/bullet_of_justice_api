import mongoose from "mongoose";

const ScoreboardSchema = new mongoose.Schema({
  username: { type: String, required: true },
  score: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Scoreboard || mongoose.model("Scoreboard", ScoreboardSchema);
