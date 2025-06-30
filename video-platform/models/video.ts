import mongoose, { Schema, model, models } from "mongoose";

export interface IVideo {
  _id?: mongoose.Types.ObjectId;
  title: string;
  description: string;
  videoUrl: string;
  thumbnailUrl: string;
  controls?: boolean;
  transformation?: {
    height?: number;
    width?: number;
    quality?: number;
  };
}

const videoSchema = new Schema<IVideo>(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    videoUrl: { type: String, required: true },
    thumbnailUrl: { type: String, required: true },
    controls: { type: Boolean, default: true },
    transformation: {
      height: { type: Number }, // No default
      width: { type: Number },  // No default
      quality: { type: Number, min: 1, max: 100 }, // Optional, constrained
    },
  },
  {
    timestamps: true,
  }
);

const Video = models?.Video || model<IVideo>("Video", videoSchema);
export default Video;
