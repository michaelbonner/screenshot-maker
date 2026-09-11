#!/usr/bin/env node
// Regenerates every raster icon and the social card from the two SVG sources:
//
//   public/logo.svg    the full lockup mark (capture brackets + browser window)
//   src/app/icon.svg   the compact mark used where 16px legibility matters
//
// Run with `bun run icons` after editing either SVG.
//
// Note: the social card renders its text with Helvetica Neue, which is what
// librsvg picks up on macOS. On a machine without it the type will fall back
// to something else, so regenerate on macOS to keep the committed PNG stable.
import { readFile, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const at = (...parts) => join(root, ...parts);

const DENSITY = 1200;
const INDIGO = "#4f46e5";

const logoSvg = await readFile(at("public", "logo.svg"), "utf8");
const iconSvg = await readFile(at("src", "app", "icon.svg"), "utf8");

const renderIcon = (svg, size) =>
  sharp(Buffer.from(svg), { density: DENSITY }).resize(size, size).png().toBuffer();

// iOS masks the icon itself, so the home screen artwork needs square corners.
const ROUNDED_BG = '<rect width="64" height="64" rx="14" fill="url(#bg)" />';
if (!iconSvg.includes(ROUNDED_BG)) {
  throw new Error("icon.svg no longer contains the background rect the apple-icon squares off");
}
const appleSvg = iconSvg.replace(ROUNDED_BG, '<rect width="64" height="64" fill="url(#bg)" />');

await writeFile(at("src", "app", "apple-icon.png"), await renderIcon(appleSvg, 180));

// Legacy .ico for browsers that ignore icon.svg. An ICO may wrap a PNG
// verbatim, so this is a 22-byte header plus the 32px render.
const ico32 = await renderIcon(iconSvg, 32);
const header = Buffer.alloc(22);
header.writeUInt16LE(0, 0); // reserved
header.writeUInt16LE(1, 2); // type: icon
header.writeUInt16LE(1, 4); // one image
header.writeUInt8(32, 6); // width
header.writeUInt8(32, 7); // height
header.writeUInt8(0, 8); // palette colors (0 = truecolor)
header.writeUInt8(0, 9); // reserved
header.writeUInt16LE(1, 10); // color planes
header.writeUInt16LE(32, 12); // bits per pixel
header.writeUInt32LE(ico32.length, 14);
header.writeUInt32LE(header.length, 18);
await writeFile(at("src", "app", "favicon.ico"), Buffer.concat([header, ico32]));

// Social card. Text and furniture render first, then the mark is composited in
// as a raster so we never depend on librsvg's nested-SVG support.
const W = 1200;
const H = 630;
const card = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="${W}" y2="${H}" gradientUnits="userSpaceOnUse">
      <stop stop-color="#0b0b1b" />
      <stop offset="1" stop-color="#241f5c" />
    </linearGradient>
    <radialGradient id="glow" cx="0" cy="0" r="1"
      gradientTransform="translate(980 90) rotate(120) scale(520)" gradientUnits="userSpaceOnUse">
      <stop stop-color="#6366f1" stop-opacity=".45" />
      <stop offset="1" stop-color="#6366f1" stop-opacity="0" />
    </radialGradient>
  </defs>
  <rect width="${W}" height="${H}" fill="url(#bg)" />
  <rect width="${W}" height="${H}" fill="url(#glow)" />
  <g stroke="${INDIGO}" stroke-width="10" stroke-linecap="round" stroke-linejoin="round" fill="none" opacity=".85">
    <path d="M44 128V76a32 32 0 0 1 32-32h52" />
    <path d="M1072 44h52a32 32 0 0 1 32 32v52" />
    <path d="M1156 502v52a32 32 0 0 1-32 32h-52" />
    <path d="M128 586H76a32 32 0 0 1-32-32v-52" />
  </g>
  <g font-family="Helvetica Neue, Helvetica, Arial, sans-serif">
    <text x="112" y="370" font-size="76" font-weight="700" fill="#ffffff" letter-spacing="-1.5">Screenshot Maker</text>
    <text x="112" y="428" font-size="31" fill="#a5b4fc">Screenshot any URL with a single API call.</text>
    <text x="112" y="520" font-size="25" font-weight="500" fill="#818cf8" letter-spacing=".4">screenshot-maker.bootpack.dev</text>
  </g>
</svg>`;

// The mark sits on a dark card here, so its brackets get the lighter indigo
// the site uses in dark mode.
const darkMark = logoSvg.toString().replaceAll(INDIGO, "#818cf8");
const mark = await sharp(Buffer.from(darkMark), { density: DENSITY }).resize(132, 132).png().toBuffer();
const socialCard = await sharp(Buffer.from(card), { density: 72 })
  .composite([{ input: mark, top: 148, left: 112 }])
  .png({ compressionLevel: 9 })
  .toBuffer();

await writeFile(at("src", "app", "opengraph-image.png"), socialCard);
await writeFile(at("src", "app", "twitter-image.png"), socialCard);

console.log("Generated apple-icon.png, favicon.ico, opengraph-image.png, twitter-image.png");
