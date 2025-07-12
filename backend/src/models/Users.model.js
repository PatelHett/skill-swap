import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: [true, "password is required"],
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    banned: {
      type: Boolean,
      default: false,
    },
    resetCode: String, // Added for password reset
  },
  { timestamps: true }
);

//so this is  pre save hook of mongo db and it runs before saving any kind of data

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next;
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

//custom hook's

//password check
userSchema.methods.isPasswordCorrect = async function (password) {
  return await bcrypt.compare(password, this.password);
};

//generate access token
userSchema.methods.generateAccessToken = async function () {
  return jwt.sign(
    {
      _id: this._id,
      email: this.email,
      role: this.role,
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: parseInt(process.env.ACCESS_TOKEN_EXPIRY_MS), //for time being only two hour's
    }
  );
};

//generate refresh token
userSchema.methods.generateRefreshToken = async function () {
  return jwt.sign(
    {
      _id: this._id,
    },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: parseInt(process.env.REFRESH_TOKEN_EXPIRY_MS) } //expires in 7 days
  );
};

const User = mongoose.model("User", userSchema);

export default User;
