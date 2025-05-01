import { unstable_cache } from "next/cache";
import { headers } from "next/headers";
import { checkAuth, getScreenshotAsBase64 } from "./helpers";
import { z } from "zod";

const DEFAULT_WIDTH = 1920;
const DEFAULT_HEIGHT = 1080;
const DEFAULT_SCALE = 0.25;
const DEFAULT_QUALITY = 50;
const DEFAULT_FULL_PAGE = false;

const inputSchema = z.object({
  url: z.string().url(),
  width: z.coerce.number().optional().default(DEFAULT_WIDTH),
  height: z.coerce.number().optional().default(DEFAULT_HEIGHT),
  scale: z.coerce.number().max(1).optional().default(DEFAULT_SCALE),
  quality: z.coerce
    .number()
    .min(0)
    .max(100)
    .optional()
    .default(DEFAULT_QUALITY),
  fullPage: z.coerce.boolean().optional().default(DEFAULT_FULL_PAGE),
});

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
    quality,
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
      validationResult.data.width.toString(),
      validationResult.data.height.toString(),
      validationResult.data.scale.toString(),
      validationResult.data.quality.toString(),
      validationResult.data.fullPage.toString(),
    ],
    {
      tags: [validationResult.data.url],
      // 1 hour
      revalidate: 3600,
    }
  );

  const screenshot = await getCachedScreenshot(
    validationResult.data.url,
    validationResult.data.width,
    validationResult.data.height,
    validationResult.data.scale,
    validationResult.data.quality,
    validationResult.data.fullPage
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
