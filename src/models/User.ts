import mongoose, { Document, Model } from "mongoose";
import validator from "validator";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import ENV from "../utils/environment";

interface UserDocument extends Document {
  _id: mongoose.Types.ObjectId;
  username: string;
  emailAddress: string;
  password: string;
  isPenalized: "yes" | "no";
  penaltyEndDate: Date;
  tokens: Array<{ token: string }>;

  toJSON(): object;
  generateAuthToken(): Promise<string>;
}

interface UserModel extends Model<UserDocument> {
  findByCredentials(username: string, password: string): Promise<UserDocument>;
}

const userSchema = new mongoose.Schema<UserDocument>(
  {
    username: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    emailAddress: {
      type: String,
      unique: true,
      required: true,
      trim: true,
      lowercase: true,
      index: true,
      validate(value: string) {
        if (!validator.isEmail(value)) {
          throw new Error("Email is invalid");
        }
      },
    },
    password: {
      type: String,
      required: true,
      minlength: 7,
      trim: true,
      validate(value: string) {
        if (value.toLowerCase().includes("password")) {
          throw new Error('Password cannot contain "password"');
        }
      },
    },
    isPenalized: {
      type: String,
      enum: ["yes", "no"],
      required: true,
      index: true,
      default: "no",
    },
    penaltyEndDate: {
      type: Date,
      trim: true,
      index: true,
    },
    tokens: [
      {
        token: {
          type: String,
          required: true,
        },
      },
    ],
  },
  {
    timestamps: true,
    versionKey: "version",
  }
);

userSchema.methods.toJSON = function (): object {
  const user = this as UserDocument;
  const userObject = user.toObject();

  delete userObject.password;
  delete userObject.tokens;

  return userObject;
};

userSchema.methods.generateAuthToken = async function (): Promise<string> {
  const user = this as UserDocument;
  const token = jwt.sign({ _id: user._id.toString() }, ENV.jwtSecret!, {
    expiresIn: ENV.jwtExpriresIn!,
  });

  user.tokens = user.tokens.concat({ token });
  await user.save();

  return token;
};

userSchema.statics.findByCredentials = async (
  username: string,
  password: string
): Promise<UserDocument> => {
  const user = await User.findOne({ username });

  if (!user) {
    throw new Error("Unable to login, wrong Username");
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    throw new Error("Unable to login, wrong Password");
  }

  return user;
};

userSchema.pre("save", async function (next) {
  const user = this as UserDocument;

  if (user.isModified("password")) {
    user.password = await bcrypt.hash(user.password, 8);
  }

  next();
});

const User = mongoose.model<UserDocument, UserModel>("User", userSchema);

export default User;
