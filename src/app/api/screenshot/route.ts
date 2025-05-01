import { unstable_cache } from "next/cache";
import { headers } from "next/headers";
import { checkAuth, getScreenshotAsBase64 } from "./helpers";
import {
  DEFAULT_FULL_PAGE,
  DEFAULT_HEIGHT,
  DEFAULT_QUALITY,
  DEFAULT_SCALE,
  DEFAULT_TYPE,
  DEFAULT_WIDTH,
  inputSchema,
} from "./validation";
import { ScreenshotOptions } from "puppeteer-core";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const headersList = await headers();

  const { url, width, height, scale, key, quality, fullPage, type } =
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
    type,
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
      fullPage: boolean,
      type: ScreenshotOptions["type"]
    ) =>
      getScreenshotAsBase64(url, {
        width: width || DEFAULT_WIDTH,
        height: height || DEFAULT_HEIGHT,
        scale: scale || DEFAULT_SCALE,
        quality: quality || DEFAULT_QUALITY,
        fullPage: fullPage ?? DEFAULT_FULL_PAGE,
        type: type ?? DEFAULT_TYPE,
      }),
    [
      validationResult.data.url,
      validationResult.data.width?.toString() || DEFAULT_WIDTH.toString(),
      validationResult.data.height?.toString() || DEFAULT_HEIGHT.toString(),
      validationResult.data.scale?.toString() || DEFAULT_SCALE.toString(),
      validationResult.data.quality?.toString() || DEFAULT_QUALITY.toString(),
      validationResult.data.fullPage?.toString() ||
        DEFAULT_FULL_PAGE.toString(),
      validationResult.data.type || DEFAULT_TYPE,
    ],
    {
      tags: [validationResult.data.url],
      // 1 hour
      revalidate: 3600,
    }
  );

  const screenshot = await getCachedScreenshot(
    validationResult.data.url,
    validationResult.data.width || DEFAULT_WIDTH,
    validationResult.data.height || DEFAULT_HEIGHT,
    validationResult.data.scale || DEFAULT_SCALE,
    validationResult.data.quality || DEFAULT_QUALITY,
    validationResult.data.fullPage || DEFAULT_FULL_PAGE,
    validationResult.data.type || DEFAULT_TYPE
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

  const screenshotType = validationResult.data.type || DEFAULT_TYPE;

  //   convert the base64 string to a buffer we can return as an image response
  const buffer = Buffer.from(screenshot, "base64");
  return new Response(buffer, {
    status: 200,
    headers: {
      "Content-Type": `image/${screenshotType}`,
      "Content-Disposition": `inline; filename="${url}.${screenshotType}"`,
      "Content-Length": buffer.length.toString(),
      "Cache-Control": "public, max-age=3600",
    },
  });
}
