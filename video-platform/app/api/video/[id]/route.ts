import { authOptions } from "@/lib/auth";
import { connectToDatabase } from "@/lib/db";
import Video from "@/models/video";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

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
