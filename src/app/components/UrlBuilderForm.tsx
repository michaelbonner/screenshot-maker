"use client";

import Link from "next/link";
import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import {
  DEFAULT_HEIGHT,
  DEFAULT_QUALITY,
  DEFAULT_SCALE,
  DEFAULT_WIDTH,
  inputSchema,
} from "../api/screenshot/validation";
import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";

const url = "https://bootpackdigital.com";

type Inputs = z.infer<typeof inputSchema>;

export const UrlBuilderForm = () => {
  const [generatedUrl, setGeneratedUrl] = useState(
    "Generate a URL to get started"
  );

  useEffect(() => {
    setGeneratedUrl(
      generateUrl({
        url,
        width: 0,
        height: 0,
        scale: 0,
        quality: 0,
        fullPage: false,
      })
    );
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>({
    defaultValues: {
      url,
    },
    resolver: zodResolver(inputSchema),
  });

  const generateUrl = (data: Inputs) => {
    const screenshotUrl = new URL(window.location.origin);
    screenshotUrl.pathname = "/api/screenshot";

    const objectKeys = Object.keys(data);

    objectKeys.forEach((key) => {
      if (data[key as keyof Inputs]) {
        screenshotUrl.searchParams.set(
          key,
          data[key as keyof Inputs]?.toString() || ""
        );
      }
    });

    return screenshotUrl.toString();
  };

  const onSubmit: SubmitHandler<Inputs> = (data) => {
    setGeneratedUrl(generateUrl(data));
  };

  return (
    <div className="grid gap-8 border p-8">
      <form
        method="GET"
        action="/api/screenshot"
        target="_blank"
        className="grid gap-x-4 gap-y-6"
        onSubmit={handleSubmit(onSubmit)}
      >
        <div>
          <label className={styles.label} htmlFor="url">
            URL
          </label>
          <input
            className={styles.inputText}
            type="text"
            id="url"
            placeholder="https://..."
            {...register("url")}
          />
          {errors.url && (
            <span className={styles.error}>{errors.url.message}</span>
          )}
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
          <div>
            <label className={styles.label} htmlFor="width">
              Width
            </label>
            <input
              className={styles.inputText}
              id="width"
              max={3840}
              min={1}
              placeholder={DEFAULT_WIDTH.toString()}
              step={1}
              type="number"
              {...register("width")}
            />
            {errors.width && (
              <span className={styles.error}>{errors.width.message}</span>
            )}
          </div>
          <div>
            <label className={styles.label} htmlFor="height">
              Height
            </label>
            <input
              className={styles.inputText}
              id="height"
              max={2160}
              min={1}
              placeholder={DEFAULT_HEIGHT.toString()}
              step={1}
              type="number"
              {...register("height")}
            />
            {errors.height && (
              <span className={styles.error}>{errors.height.message}</span>
            )}
          </div>
          <div>
            <label className={styles.label} htmlFor="scale">
              Scale
            </label>
            <input
              className={styles.inputText}
              id="scale"
              max={1}
              min={0.1}
              placeholder={DEFAULT_SCALE.toString()}
              step={0.1}
              type="number"
              {...register("scale")}
            />
            {errors.scale && (
              <span className={styles.error}>{errors.scale.message}</span>
            )}
          </div>
          <div>
            <label className={styles.label} htmlFor="quality">
              Quality
            </label>
            <input
              className={styles.inputText}
              id="quality"
              max={100}
              min={1}
              step={1}
              type="number"
              placeholder={DEFAULT_QUALITY.toString()}
              {...register("quality")}
            />
            {errors.quality && (
              <span className={styles.error}>{errors.quality.message}</span>
            )}
          </div>
          <div>
            <label className={styles.label} htmlFor="fullPage">
              Full Page
            </label>
            <input
              className={styles.checkbox}
              id="fullPage"
              type="checkbox"
              {...register("fullPage")}
            />
            {errors.fullPage && (
              <span className={styles.error}>{errors.fullPage.message}</span>
            )}
          </div>
        </div>
        <div className="mt-2">
          <button className={styles.button} type="submit">
            Generate Screenshot URL
          </button>
        </div>
      </form>

      <div>
        <h3>Generated URL</h3>
        <div>
          <code>
            <Link
              className="underline underline-offset-4 break-all"
              href={generatedUrl}
              target="_blank"
            >
              {generatedUrl}
            </Link>
          </code>
        </div>
      </div>
    </div>
  );
};

const styles = {
  label: "block text-sm font-medium mb-2",
  inputText: "block w-full border rounded-md p-2",
  checkbox:
    "block size-10 appearance-none rounded-md border border-gray-300 checked:bg-indigo-500 checked:border-2",
  button: "bg-indigo-500 text-white px-4 py-2 rounded-md cursor-pointer",
  error: "text-red-500 text-sm",
};
