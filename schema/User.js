import bcrypt from "bcryptjs";
import mongoose from "mongoose";
const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  password: {
    type: String,
    required: false,
  },
  To: [{  
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  From: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }]
});

// Pre-save middleware to hash the password before saving
UserSchema.pre("save", async function (next) {
  const user = this;
  if (user.isModified("password")) {
    user.password = await bcrypt.hash(user.password, 8);
  }
  next();
});

const User = mongoose.model("User", UserSchema);

export default User;
