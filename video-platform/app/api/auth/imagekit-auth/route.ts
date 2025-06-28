import { getUploadAuthParams } from "@imagekit/next/server";

export async function GET() {
  try {
    const authenticationParameters = getUploadAuthParams({
      privateKey: process.env.IMAGEKIT_PRIVATE_KEY as string,
      publicKey: process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY as string,
    });
  
    return Response.json({
      authenticationParameters,
      publicKey: process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY,
    });
  } catch (error) {
    console.error("Error generating ImageKit authentication parameters:", error);
    return Response.json(
      { error: "Failed to generate Imagekit authentication parameters" },
      { status: 500 }
    );
  }
}
