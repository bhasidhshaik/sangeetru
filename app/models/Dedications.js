// models/Dedication.js
import mongoose from "mongoose";

const DedicationSchema = new mongoose.Schema({
  sender: String,            // sender's name
  recipient: String,         // recipient's name
  message: String,           // message text
  song: String,              // short song name or ID
  fullSongName: String,      // full song title or description
  lyrics: String,            // full lyrics text
  selectedSongTitle: String, // selected song title snippet or empty string
  selectedLyrics: String,    // selected lyrics snippet
  userId: String,            // persistent unique user id
  youtubeUrl: String,        // YouTube URL of the song
  timestamp: { type: Date, default: Date.now }
});

// Avoid model overwrite error in dev
export default mongoose.models.Dedication || mongoose.model("Dedication", DedicationSchema);
