"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useEffect, useState } from "react";
import {
  FormProvider,
  SubmitHandler,
  useForm,
  useFormContext,
} from "react-hook-form";
import { z } from "zod";
import {
  DEFAULT_HEIGHT,
  DEFAULT_QUALITY,
  DEFAULT_SCALE,
  DEFAULT_WIDTH,
  inputSchema,
} from "../api/screenshot/validation";

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

  const methods = useForm<Inputs>({
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
      <FormProvider {...methods}>
        <form
          method="GET"
          action="/api/screenshot"
          target="_blank"
          className="grid gap-x-4 gap-y-6"
          onSubmit={methods.handleSubmit(onSubmit)}
        >
          <InputField
            label="URL"
            id="url"
            type="text"
            placeholder="https://..."
          />
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
            <InputField
              label="Width"
              id="width"
              type="number"
              placeholder={DEFAULT_WIDTH.toString()}
            />
            <InputField
              label="Height"
              id="height"
              type="number"
              placeholder={DEFAULT_HEIGHT.toString()}
            />
            <InputField
              label="Scale"
              id="scale"
              type="number"
              placeholder={DEFAULT_SCALE.toString()}
            />
            <InputField
              label="Quality"
              id="quality"
              type="number"
              placeholder={DEFAULT_QUALITY.toString()}
            />
            <InputField label="Full Page" id="fullPage" type="checkbox" />
          </div>
          <InputField label="API Key" id="key" type="text" />
          <div className="mt-2">
            <button className={styles.button} type="submit">
              Generate Screenshot URL
            </button>
          </div>
        </form>
      </FormProvider>

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

const InputField = ({
  label,
  id,
  ...props
}: {
  label: string;
  id: keyof Inputs;
} & React.InputHTMLAttributes<HTMLInputElement>) => {
  const {
    register,
    formState: { errors },
  } = useFormContext<Inputs>();

  return (
    <div>
      <label className={styles.label} htmlFor={id}>
        {label}
      </label>
      <input
        id={id}
        className={
          props.type === "checkbox" ? styles.checkbox : styles.inputText
        }
        {...props}
        {...register(id)}
      />
      {errors[id] && (
        <span className={styles.error}>{errors[id]?.message}</span>
      )}
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
