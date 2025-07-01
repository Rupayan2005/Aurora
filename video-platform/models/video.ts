// import mongoose, { Schema, model, models } from "mongoose";

// export interface IVideo {
//   _id?: mongoose.Types.ObjectId;
//   title: string;
//   description: string;
//   videoUrl: string;
//   thumbnailUrl: string;
//   controls?: boolean;
//   transformation?: {
//     height?: number;
//     width?: number;
//     quality?: number;
//   };
// }

// const videoSchema = new Schema<IVideo>(
//   {
//     title: { type: String, required: true },
//     description: { type: String, required: true },
//     videoUrl: { type: String, required: true },
//     thumbnailUrl: { type: String, required: true },
//     controls: { type: Boolean, default: true },
//     transformation: {
//       height: { type: Number }, // No default
//       width: { type: Number },  // No default
//       quality: { type: Number, min: 1, max: 100 }, // Optional, constrained
//     },
//   },
//   {
//     timestamps: true,
//   }
// );
import { Schema, model, models } from "mongoose";

export interface IVideo {
  title: string;
  description: string;
  videoUrl: string;
  thumbnailUrl: string;
  fileId?: string; // Add ImageKit file ID
  userId: string; // Add this field
  controls?: boolean;
  transformation?: {
    height?: number;
    width?: number;
    quality?: number;
  };
  createdAt: Date;
  updatedAt: Date;
}

const videoSchema = new Schema<IVideo>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    videoUrl: {
      type: String,
      required: true,
    },
    thumbnailUrl: {
      type: String,
      required: true,
    },
    fileId: {
      type: String,
      required: false, // Optional for backward compatibility
    },
    userId: {
      type: String,
      required: true,
      index: true, // Add index for better query performance
    },
    controls: {
      type: Boolean,
      default: true,
    },
    transformation: {
      height: {
        type: Number,
      },
      width: {
        type: Number,
      },
      quality: {
        type: Number,
      },
    },
  },
  {
    timestamps: true,
  }
);

// Create compound index for userId and createdAt for efficient querying
videoSchema.index({ userId: 1, createdAt: -1 });

const Video = models?.Video || model<IVideo>("Video", videoSchema);
export default Video;
