"use client";

import {
  ImageKitAbortError,
  ImageKitInvalidRequestError,
  ImageKitServerError,
  ImageKitUploadNetworkError,
  upload,
  type UploadResponse,
} from "@imagekit/next";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, Check, X, ArrowLeft, Play } from "lucide-react";

interface FileUploadProps {
  onBack: () => void;
}

interface VideoData {
  title: string;
  description: string;
  file: File | null;
  uploadResponse: UploadResponse | null;
}

const FileUpload = ({ onBack }: FileUploadProps) => {
  const [videoData, setVideoData] = useState<VideoData>({
    title: "",
    description: "",
    file: null,
    uploadResponse: null,
  });
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [publishing, setPublishing] = useState(false);

  const validateFile = (file: File) => {
    if (!file.type.startsWith("video/")) {
      setError("Please upload a video file");
      return false;
    }
    if (file.size > 100 * 1024 * 1024) {
      setError("File size should be less than 100MB");
      return false;
    }
    return true;
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!validateFile(file)) {
      return;
    }

    setVideoData((prev) => ({ ...prev, file }));
    setUploading(true);
    setError(null);
    setUploadProgress(0);

    try {
      const authRes = await fetch("/api/auth/imagekit-auth");
      const auth = await authRes.json();

      const res = await upload({
        file,
        fileName: file.name,
        publicKey: process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY!,
        signature: auth.signature,
        expire: auth.expire,
        token: auth.token,
        onProgress: (event) => {
          if (event.lengthComputable) {
            const percent = (event.loaded / event.total) * 100;
            setUploadProgress(Math.round(percent));
          }
        },
      });

      setVideoData((prev) => ({ ...prev, uploadResponse: res }));
    } catch (err) {
      if (err instanceof ImageKitInvalidRequestError) {
        setError("Invalid request. Please check the file type and size.");
      } else if (err instanceof ImageKitUploadNetworkError) {
        setError("Network error occurred during upload.");
      } else if (err instanceof ImageKitServerError) {
        setError("Server error occurred during upload.");
      } else if (err instanceof ImageKitAbortError) {
        setError("Upload was aborted.");
      } else {
        setError("An unexpected error occurred.");
      }
    } finally {
      setUploading(false);
    }
  };

  const handlePublish = async () => {
    if (!videoData.title || !videoData.uploadResponse) {
      setError("Please provide a title and upload a video");
      return;
    }

    setPublishing(true);
    try {
      const response = await fetch("/api/video", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: videoData.title,
          description: videoData.description,
          videoUrl: videoData.uploadResponse.url,
          thumbnailUrl:
            videoData.uploadResponse.thumbnailUrl ||
            videoData.uploadResponse.url,
          fileId: videoData.uploadResponse.fileId, // Add fileId for ImageKit deletion
        }),
      });

      if (response.ok) {
        setShowSuccessModal(true);
      } else {
        setError("Failed to publish video");
      }
    } catch {
      setError("An error occurred while publishing");
    } finally {
      setPublishing(false);
    }
  };

  const canPublish = videoData.title && videoData.uploadResponse && !uploading;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center mb-8"
        >
          <button
            onClick={onBack}
            className="flex items-center text-blue-400 hover:text-blue-300 transition-colors mr-4"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Dashboard
          </button>
        </motion.div>

        <div className="max-w-2xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-8 border border-slate-700/50"
          >
            <h1 className="text-3xl font-bold text-white mb-8 text-center">
              Upload Video
            </h1>

            {/* Title Input */}
            <div className="mb-6">
              <label className="block text-blue-300 text-sm font-medium mb-2">
                Video Title *
              </label>
              <input
                type="text"
                value={videoData.title}
                onChange={(e) =>
                  setVideoData((prev) => ({ ...prev, title: e.target.value }))
                }
                className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="Enter video title..."
              />
            </div>

            {/* Description Input */}
            <div className="mb-6">
              <label className="block text-blue-300 text-sm font-medium mb-2">
                Description
              </label>
              <textarea
                value={videoData.description}
                onChange={(e) =>
                  setVideoData((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
                rows={4}
                className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                placeholder="Describe your video..."
              />
            </div>

            {/* File Upload */}
            <div className="mb-8">
              <label className="block text-blue-300 text-sm font-medium mb-2">
                Video File *
              </label>
              <div className="relative">
                <input
                  type="file"
                  accept="video/*"
                  onChange={handleFileChange}
                  className="hidden"
                  id="video-upload"
                />
                <label
                  htmlFor="video-upload"
                  className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-slate-600 rounded-lg cursor-pointer bg-slate-700/30 hover:bg-slate-700/50 transition-all group"
                >
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <Upload className="w-8 h-8 mb-4 text-slate-400 group-hover:text-blue-400 transition-colors" />
                    <p className="mb-2 text-sm text-slate-400 group-hover:text-blue-400 transition-colors">
                      <span className="font-semibold">Click to upload</span>{" "}
                      your video
                    </p>
                    <p className="text-xs text-slate-500">
                      MP4, MOV, AVI (MAX. 100MB)
                    </p>
                  </div>
                </label>
              </div>

              {/* Upload Progress */}
              {uploading && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  className="mt-4"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-blue-300">Uploading...</span>
                    <span className="text-sm text-blue-300">
                      {uploadProgress}%
                    </span>
                  </div>
                  <div className="w-full bg-slate-700 rounded-full h-2">
                    <motion.div
                      className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${uploadProgress}%` }}
                      transition={{ duration: 0.3 }}
                    />
                  </div>
                </motion.div>
              )}

              {/* File Info */}
              {videoData.file && !uploading && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-4 p-3 bg-slate-700/50 rounded-lg flex items-center"
                >
                  <Play className="w-5 h-5 text-green-400 mr-3" />
                  <div>
                    <p className="text-white text-sm font-medium">
                      {videoData.file.name}
                    </p>
                    <p className="text-slate-400 text-xs">
                      {(videoData.file.size / (1024 * 1024)).toFixed(2)} MB
                    </p>
                  </div>
                  {videoData.uploadResponse && (
                    <Check className="w-5 h-5 text-green-400 ml-auto" />
                  )}
                </motion.div>
              )}
            </div>

            {/* Error Message */}
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="mb-6 p-3 bg-red-500/20 border border-red-500/50 rounded-lg flex items-center"
                >
                  <X className="w-5 h-5 text-red-400 mr-3" />
                  <p className="text-red-300 text-sm">{error}</p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Publish Button */}
            <motion.button
              onClick={handlePublish}
              disabled={!canPublish || publishing}
              className={`w-full py-3 px-6 rounded-lg font-medium transition-all ${
                canPublish && !publishing
                  ? "bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white"
                  : "bg-slate-600 text-slate-400 cursor-not-allowed"
              }`}
              whileHover={canPublish ? { scale: 1.02 } : {}}
              whileTap={canPublish ? { scale: 0.98 } : {}}
            >
              {publishing ? "Publishing..." : "Publish Video"}
            </motion.button>
          </motion.div>
        </div>
      </div>

      {/* Success Modal */}
      <AnimatePresence>
        {showSuccessModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-slate-800 rounded-2xl p-8 max-w-md mx-4 border border-slate-700"
            >
              <div className="text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                  className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4"
                >
                  <Check className="w-8 h-8 text-green-400" />
                </motion.div>
                <h3 className="text-2xl font-bold text-white mb-2">Success!</h3>
                <p className="text-slate-300 mb-6">
                  Your video has been uploaded successfully and is now live on
                  your dashboard.
                </p>
                <button
                  onClick={() => {
                    setShowSuccessModal(false);
                    onBack();
                  }}
                  className="w-full py-3 px-6 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white rounded-lg font-medium transition-all"
                >
                  Go to Dashboard
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default FileUpload;
