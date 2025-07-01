import { authOptions } from "@/lib/auth";
import { connectToDatabase } from "@/lib/db";
import Video from "@/models/video";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import ImageKit from "imagekit";

// Initialize ImageKit
const imagekit = new ImageKit({
  publicKey: process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY!,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY!,
  urlEndpoint: process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT!,
});

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectToDatabase();
    const videoId = params.id;

    // First, find the video to get the fileId and verify ownership
    const video = await Video.findById(videoId);
    if (!video) {
      return NextResponse.json({ error: "Video not found" }, { status: 404 });
    }

    // Verify that the user owns this video
    if (video.userId !== session.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized - You can only delete your own videos" },
        { status: 403 }
      );
    }

    // Delete from ImageKit if fileId exists
    if (video.fileId) {
      try {
        await imagekit.deleteFile(video.fileId);
        console.log("Successfully deleted file from ImageKit:", video.fileId);
      } catch (imagekitError) {
        console.error("Failed to delete file from ImageKit:", imagekitError);
        // Continue with MongoDB deletion even if ImageKit deletion fails
        // You can choose to return an error here if you want to ensure both deletions succeed
      }
    }

    // Delete from MongoDB
    const deletedVideo = await Video.findByIdAndDelete(videoId);
    if (!deletedVideo) {
      return NextResponse.json({ error: "Video not found" }, { status: 404 });
    }

    return NextResponse.json(
      { message: "Video deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting video:", error);
    return NextResponse.json(
      { error: "Failed to delete video" },
      { status: 500 }
    );
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectToDatabase();
    const videoId = params.id;

    const video = await Video.findById(videoId).lean();
    if (!video) {
      return NextResponse.json({ error: "Video not found" }, { status: 404 });
    }

    return NextResponse.json(video, { status: 200 });
  } catch (error) {
    console.error("Error fetching video:", error);
    return NextResponse.json(
      { error: "Failed to fetch video" },
      { status: 500 }
    );
  }
}
