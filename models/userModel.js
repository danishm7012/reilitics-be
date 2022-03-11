import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    username: {
      type: String,
      required: true,
      unique: true,
    },

    password: {
      type: String
    },
    image: {
      type: String,
      default: "https://cdn-icons-png.flaticon.com/512/149/149071.png",
    },
    phone: {
      type: String,
    },
    country: {
      type: String,
    },
    state: {
      type: String,
    },
    date_of_birth: {
      type: Date,
    },

    role: {
      type: String,
      default: "user",
    },
    accountStatus: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },

    packageID: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    packageStatus: {
      type: Boolean,
      default: false,
    },

    social_login: {
      type: Boolean,
      default: false,
    },
    social_login_ID: {
      type: String,
    },
    social_provider: {
      type: String,
      default: null,
    },

    email_varification: {
      type: Boolean,
      default: false,
    },
    confirmation_code: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

const User = mongoose.model("User", userSchema);

export default User;
