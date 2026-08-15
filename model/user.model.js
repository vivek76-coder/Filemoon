const { Schema, model } = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new Schema({
  image: {
    type: String
  },
  fullname: {
    type: String,
    trim: true,
    lowercase: true,
    required: true,
  },
  mobile: {
    type: String,
    trim: true,
    required: true,
  },
  email: {
    type: String,
    trim: true,
    match: [/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, "invalid mail"],
    required: true,
  },
  password: {
    type: String,
    trim: true,
    required: true,
  },
}, {timestamps: true});

userSchema.pre("save", async function (next) {
  const count = await model("User").countDocuments({ email: this.email });
  if (count > 0) {
    throw new Error("email already exist");
  }
});

userSchema.pre("save", async function (next) {
  const count = await model("User").countDocuments({ mobile : this.mobile });
  if (count > 0) throw new Error("Mobile number already exist");
});

userSchema.pre("save", async function (next) {
  const encryptedPassword = await bcrypt.hash(this.password.toString(), 12);
  this.password = encryptedPassword;
});
const UserModel = model("User", userSchema);
module.exports = UserModel;
