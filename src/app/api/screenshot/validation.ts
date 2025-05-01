import { z } from "zod";

export const DEFAULT_WIDTH = 1920;
export const DEFAULT_HEIGHT = 1080;
export const DEFAULT_SCALE = 0.25;
export const DEFAULT_QUALITY = 50;
export const DEFAULT_FULL_PAGE = false;

export const inputSchema = z.object({
  url: z.string().url(),
  width: z.union([z.coerce.number().min(1), z.literal("")]).optional(),
  height: z.union([z.coerce.number().min(1), z.literal("")]).optional(),
  scale: z.union([z.coerce.number().min(0.1).max(1), z.literal("")]).optional(),
  quality: z
    .union([z.coerce.number().min(1).max(100), z.literal("")])
    .optional(),
  fullPage: z.coerce.boolean().optional(),
});
