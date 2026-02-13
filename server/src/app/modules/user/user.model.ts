import { model, Schema } from "mongoose";
import { IUser, IUserMethods, IUserModel, IUserRole } from "./user.interface";
import bcrypt from "bcryptjs";

const userSchema = new Schema<IUser, IUserModel, IUserMethods>(
  {
    firstName: { type: String, required: [true, "First name is required"] },
    lastName: String,
    fullName: String,
    username: { type: String, unique: true, trim: true }, // 👈 added username
    email: { type: String, trim: true },
    phone: { type: String, required: true, unique: true, trim: true },
    password: {
      type: String,
      required: true,
      minlength: 6,
      set: (value: string) => bcrypt.hashSync(value, 10),
    },
    followers: [{ type: Schema.Types.ObjectId, ref: "User" }],
    friends: [{ type: Schema.Types.ObjectId, ref: "User" }],
    followings: [{ type: Schema.Types.ObjectId, ref: "User" }],
    settings: {
      isPrivate: { type: Boolean, default: false },
      isVerified: { type: Boolean, default: false },
      notification: { type: Boolean, default: true },
      darkMode: { type: Boolean, default: false },
    },
    twoFactor: {
      active: { type: Boolean, default: false },
      secret: String,
    },
    role: {
      type: String,
      enum: Object.values(IUserRole),
      default: IUserRole.USER,
    },
    gender: {
      type: String,
      enum: ["MALE", "FEMALE", "OTHER"],
      required: [true, "Gender is required"],
    },
    dateOfBirth: Date,
    isDeleted: {
      type: Boolean,
      default: false,
    },
    deletedAt: Date,
    isDisabled: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

userSchema.method("comparePassword", async function (password: string) {
  return bcrypt.compare(password, this.password);
});

userSchema.static("findByPhone", function (phone: string) {
  return this.findOne({ phone });
});

userSchema.pre("save", async function (next) {
  if (this.isNew) {
    // set full name
    this.fullName = this.lastName
      ? `${this.firstName} ${this.lastName}`
      : this.firstName;

    // generate username if not exists
    if (!this.username) {
      let baseUsername = this.firstName.toLowerCase();
      if (this.lastName) baseUsername += this.lastName.toLowerCase();

      // remove spaces and special chars
      baseUsername = baseUsername.replace(/[^a-z0-9\.]/g, "");

      let username = baseUsername;
      let counter = 1;

      // ensure uniqueness
      const User = this.constructor as IUserModel;
      while (await User.findOne({ username })) {
        username = `${baseUsername}${counter}`;
        counter++;
      }

      this.username = username;
    }
  }
  next();
});

const User = model<IUser, IUserModel>("User", userSchema);
export default User;
