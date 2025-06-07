import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  first_name: { type: String },
  last_name: { type: String },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phone: { type: String },
  bio: { type: String },
  location: { type: String },
}, { timestamps: true });

export default mongoose.models.User || mongoose.model('User', userSchema);
