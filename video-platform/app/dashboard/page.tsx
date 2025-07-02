"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSession, signOut } from "next-auth/react";
import Image from "next/image";
import {
  Upload,
  User,
  LogOut,
  Play,
  Calendar,
  MoreVertical,
  Search,
  Grid,
  List,
  Trash2,
} from "lucide-react";
import FileUpload from "../components/fileUpload";

interface Video {
  _id: string;
  title: string;
  description: string;
  videoUrl: string;
  thumbnailUrl: string;
  createdAt: string;
  updatedAt: string;
  userId: string; // Add userId field
  controls?: boolean;
  transformation?: {
    height: number;
    width: number;
    quality?: number;
  };
}

interface User {
  email: string;
  id: string;
}

export default function DashboardPage() {
  const { data: session } = useSession();
  const [videos, setVideos] = useState<Video[]>([]);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [showUpload, setShowUpload] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  useEffect(() => {
    const fetchVideos = async () => {
      if (!session?.user?.id) return;

      try {
        // Fetch only user's videos by passing user ID as query parameter
        const response = await fetch(`/api/video?userId=${session.user.id}`);
        if (response.ok) {
          const videosData = await response.json();
          setVideos(videosData);
        }
      } catch (error) {
        console.error("Failed to fetch videos:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchVideos();
  }, [session?.user?.id]); // Only depend on user ID

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      // Don't close if clicking on the dropdown button or dropdown menu
      if (!target.closest("[data-dropdown]")) {
        setActiveDropdown(null);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  const fetchVideos = async () => {
    try {
      // Fetch only user's videos by passing user ID as query parameter
      const response = await fetch(`/api/video?userId=${session?.user?.id}`);
      if (response.ok) {
        const videosData = await response.json();
        setVideos(videosData);
      }
    } catch (error) {
      console.error("Failed to fetch videos:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    await signOut({ callbackUrl: "/" });
  };

  const filteredVideos = videos.filter(
    (video) =>
      video.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      video.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const handleVideoClick = (video: Video) => {
    setSelectedVideo(video);
    setShowVideoModal(true);
  };

  const toggleDropdown = (videoId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setActiveDropdown(activeDropdown === videoId ? null : videoId);
  };

  const deleteVideo = async (videoId: string, e?: React.MouseEvent) => {
    if (e) {
      e.stopPropagation();
      e.preventDefault();
    }

    // Close dropdown immediately
    setActiveDropdown(null);

    try {
      const response = await fetch(`/api/video/${videoId}`, {
        method: "DELETE",
      });
      if (response.ok) {
        setVideos(videos.filter((v) => v._id !== videoId));
        if (selectedVideo?._id === videoId) {
          setShowVideoModal(false);
        }
      }
    } catch (error) {
      console.error("Failed to delete video:", error);
    }
  };

  if (showUpload) {
    return (
      <FileUpload
        onBack={() => {
          setShowUpload(false);
          fetchVideos(); // Refresh videos after upload
        }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800">
      {/* Navigation */}
      <nav className="bg-slate-800/50 backdrop-blur-sm border-b border-slate-700/50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center space-x-3"
            >
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                <Play className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-white">AURORA</h1>
            </motion.div>

            <div className="flex items-center space-x-4">
              <motion.button
                onClick={() => setShowUpload(true)}
                className="flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white px-4 py-2 rounded-lg font-medium transition-all"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Upload className="w-4 h-4" />
                <span>Upload Video</span>
              </motion.button>

              <div className="relative">
                <button
                  onClick={() => setShowProfileMenu(!showProfileMenu)}
                  className="flex items-center space-x-2 bg-slate-700/50 hover:bg-slate-700 text-white px-4 py-2 rounded-lg transition-all"
                >
                  <User className="w-4 h-4" />
                  <span className="hidden sm:inline">Profile</span>
                </button>

                <AnimatePresence>
                  {showProfileMenu && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      className="absolute right-0 mt-2 w-64 bg-slate-800 rounded-lg shadow-lg border border-slate-700 z-50"
                    >
                      <div className="p-4 border-b border-slate-700">
                        <p className="text-sm text-slate-400">Signed in as</p>
                        <p className="text-white font-medium">
                          {session?.user?.email || "Loading..."}
                        </p>
                      </div>
                      <div className="p-2">
                        <button
                          onClick={handleSignOut}
                          className="flex items-center space-x-2 w-full text-left px-3 py-2 text-red-400 hover:bg-slate-700 rounded-lg transition-all"
                        >
                          <LogOut className="w-4 h-4" />
                          <span>Sign Out</span>
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {/* Dashboard Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h2 className="text-3xl font-bold text-white mb-2">My Videos</h2>
          <p className="text-slate-400">Manage and view your uploaded videos</p>
        </motion.div>

        {/* Search and Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex flex-col sm:flex-row gap-4 mb-8"
        >
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search videos..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-slate-800/50 border border-slate-700 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div className="flex space-x-2">
            <button
              onClick={() => setViewMode(viewMode === "grid" ? "list" : "grid")}
              className="flex items-center space-x-2 px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-lg text-slate-300 hover:text-white hover:bg-slate-700/50 transition-all"
            >
              {viewMode === "grid" ? (
                <List className="w-5 h-5" />
              ) : (
                <Grid className="w-5 h-5" />
              )}
            </button>
          </div>
        </motion.div>

        {/* Videos Grid/List */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full"
            />
          </div>
        ) : filteredVideos.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-20"
          >
            <div className="w-20 h-20 bg-slate-800/50 rounded-full flex items-center justify-center mx-auto mb-4">
              <Play className="w-10 h-10 text-slate-500" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">
              No videos yet
            </h3>
            <p className="text-slate-400 mb-6">
              Upload your first video to get started
            </p>
            <motion.button
              onClick={() => setShowUpload(true)}
              className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white px-6 py-3 rounded-lg font-medium transition-all"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Upload Video
            </motion.button>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className={
              viewMode === "grid"
                ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                : "space-y-4"
            }
          >
            {filteredVideos.map((video, index) => (
              <motion.div
                key={video._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={
                  viewMode === "grid"
                    ? "bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700/50 hover:border-slate-600/50 transition-all group cursor-pointer relative"
                    : "bg-slate-800/50 backdrop-blur-sm rounded-xl p-4 border border-slate-700/50 hover:border-slate-600/50 transition-all group flex items-center space-x-4 cursor-pointer relative"
                }
                onClick={() => handleVideoClick(video)}
              >
                {/* Three-dot menu button */}
                <div className="absolute top-2 right-2 z-20" data-dropdown>
                  <button
                    className="p-2 text-slate-400 hover:text-white hover:bg-slate-700/80 rounded-lg transition-all backdrop-blur-sm"
                    onClick={(e) => toggleDropdown(video._id, e)}
                    data-dropdown
                  >
                    <MoreVertical className="w-4 h-4" />
                  </button>

                  {/* Dropdown menu */}
                  <AnimatePresence>
                    {activeDropdown === video._id && (
                      <motion.div
                        initial={{ opacity: 0, y: -10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.95 }}
                        className="absolute right-0 top-full mt-1 w-40 bg-slate-800 rounded-lg shadow-xl border border-slate-700 z-50"
                        style={{ zIndex: 9999 }}
                        data-dropdown
                      >
                        <button
                          onClick={(e) => deleteVideo(video._id, e)}
                          className="flex items-center space-x-2 w-full text-left px-3 py-2 text-red-400 hover:bg-slate-700 transition-all rounded-lg"
                          data-dropdown
                        >
                          <Trash2 className="w-4 h-4" />
                          <span>Delete</span>
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {viewMode === "grid" ? (
                  <>
                    <div className="relative aspect-video bg-slate-700 group-hover:bg-slate-600 transition-all overflow-hidden rounded-t-xl">
                      {video.thumbnailUrl ? (
                        <Image
                          src={video.thumbnailUrl}
                          alt={video.title}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <Play className="w-12 h-12 text-slate-400 group-hover:text-blue-400 transition-all" />
                        </div>
                      )}
                      <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-all" />
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all">
                        <Play className="w-16 h-16 text-white drop-shadow-lg" />
                      </div>
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold text-white mb-2 line-clamp-2 group-hover:text-blue-300 transition-all">
                        {video.title}
                      </h3>
                      <p className="text-sm text-slate-400 mb-3 line-clamp-2">
                        {video.description}
                      </p>
                      <div className="flex items-center justify-between text-xs text-slate-500">
                        <div className="flex items-center space-x-1">
                          <Calendar className="w-3 h-3" />
                          <span>{formatDate(video.createdAt)}</span>
                        </div>
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="w-32 h-20 bg-slate-700 rounded-lg flex items-center justify-center flex-shrink-0 overflow-hidden relative">
                      {video.thumbnailUrl ? (
                        <Image
                          src={video.thumbnailUrl}
                          alt={video.title}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <Play className="w-8 h-8 text-slate-400 group-hover:text-blue-400 transition-all" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-white mb-1 truncate group-hover:text-blue-300 transition-all">
                        {video.title}
                      </h3>
                      <p className="text-sm text-slate-400 mb-2 line-clamp-2">
                        {video.description}
                      </p>
                      <div className="flex items-center space-x-4 text-xs text-slate-500">
                        <div className="flex items-center space-x-1">
                          <Calendar className="w-3 h-3" />
                          <span>{formatDate(video.createdAt)}</span>
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Video Modal */}
        <AnimatePresence>
          {showVideoModal && selectedVideo && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
              onClick={() => setShowVideoModal(false)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-slate-800 rounded-xl overflow-hidden max-w-4xl w-full max-h-[90vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="aspect-video bg-black">
                  <video
                    src={selectedVideo.videoUrl}
                    controls
                    className="w-full h-full"
                    autoPlay
                  />
                </div>
                <div className="p-6">
                  <h2 className="text-2xl font-bold text-white mb-2">
                    {selectedVideo.title}
                  </h2>
                  <p className="text-slate-400 mb-4">
                    {selectedVideo.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4 text-sm text-slate-500">
                      <div className="flex items-center space-x-1">
                        <Calendar className="w-4 h-4" />
                        <span>{formatDate(selectedVideo.createdAt)}</span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => deleteVideo(selectedVideo._id)}
                        className="flex items-center space-x-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-all"
                      >
                        <Trash2 className="w-4 h-4" />
                        <span>Delete</span>
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
