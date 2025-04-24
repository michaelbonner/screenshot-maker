import { unstable_cache } from "next/cache";
import { headers } from "next/headers";
import { checkAuth, getScreenshotAsBase64, inputSchema } from "./helpers";

const DEFAULT_WIDTH = 1920;
const DEFAULT_HEIGHT = 1080;
const DEFAULT_SCALE = 0.25;
const DEFAULT_QUALITY = 50;

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const headersList = await headers();

  const { url, width, height, scale, key, quality, fullPage } =
    Object.fromEntries(searchParams.entries());

  // check key or host is valid
  if (!checkAuth(headersList, key)) {
    return Response.json({ message: `Unauthorized` }, { status: 401 });
  }

  const validationResult = inputSchema.safeParse({
    url,
    width,
    height,
    scale,
    fullPage,
  });

  if (!validationResult.success) {
    return Response.json(
      {
        message: `Invalid query parameters`,
        error: validationResult.error,
      },
      { status: 400 }
    );
  }

  const getCachedScreenshot = unstable_cache(
    async (
      url: string,
      width: number,
      height: number,
      scale: number,
      quality: number,
      fullPage: boolean
    ) =>
      getScreenshotAsBase64(url, {
        width,
        height,
        scale,
        quality,
        fullPage,
      }),
    [
      validationResult.data.url,
      width || DEFAULT_WIDTH.toString(),
      height || DEFAULT_HEIGHT.toString(),
      scale || DEFAULT_SCALE.toString(),
    ],
    {
      tags: [validationResult.data.url],
      // 1 hour
      revalidate: 3600,
    }
  );

  console.log("validationResult.data.fullPage", validationResult.data.fullPage);

  const screenshot = await getCachedScreenshot(
    validationResult.data.url,
    +(width || DEFAULT_WIDTH),
    +(height || DEFAULT_HEIGHT),
    +(scale || DEFAULT_SCALE),
    +(quality || DEFAULT_QUALITY),
    validationResult.data.fullPage ?? false
  );

  if (!screenshot) {
    return new Response(
      JSON.stringify({ error: "Failed to generate screenshot" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }

  //   convert the base64 string to a buffer we can return as an image response
  const buffer = Buffer.from(screenshot, "base64");
  return new Response(buffer, {
    status: 200,
    headers: {
      "Content-Type": "image/webp",
      "Content-Disposition": `inline; filename="${url}.webp"`,
      "Content-Length": buffer.length.toString(),
      "Cache-Control": "public, max-age=3600",
    },
  });
}
