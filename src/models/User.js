import mongoose from 'mongoose'

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    first_name: { type: String },
    last_name: { type: String },
    email: { type: String, required: true, unique: true },
    password: {
      type: String,
      required: function () {
        return !this.isOAuth // password is required only if not OAuth
      },
    },
    phone: { type: String },
    bio: { type: String },
    location: { type: String },
    isOAuth: { type: Boolean, default: false },
  },
  { timestamps: true }
)

export default mongoose.models.User || mongoose.model('User', userSchema)
