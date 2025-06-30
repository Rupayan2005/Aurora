import { getUploadAuthParams } from "@imagekit/next/server";

export async function GET() {
  try {
    const { signature, expire, token } = getUploadAuthParams({
      privateKey: process.env.IMAGEKIT_PRIVATE_KEY as string,
      publicKey: process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY as string,
    });

    return Response.json({ signature, expire, token });
  } catch (error) {
    console.error("Error generating ImageKit authentication parameters:", error);
    return Response.json(
      { error: "Failed to generate Imagekit authentication parameters" },
      { status: 500 }
    );
  }
}
