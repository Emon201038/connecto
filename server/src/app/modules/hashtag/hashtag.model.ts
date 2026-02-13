import { model, Schema } from "mongoose";
import { IHashtag } from "./hashtag.interface";

const hashtagSchema = new Schema<IHashtag>(
  {
    tag: { type: String, required: true, unique: true },
    usageCount: { type: Number, default: 1 },

    createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
  },
  {
    timestamps: true,
  }
);

const Hashtag = model<IHashtag>("Hashtag", hashtagSchema);
export default Hashtag;
