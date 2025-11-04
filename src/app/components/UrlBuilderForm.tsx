"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useEffect, useState } from "react";
import {
  FormProvider,
  Resolver,
  SubmitHandler,
  useForm,
  useFormContext,
} from "react-hook-form";
import { z } from "zod";
import {
  DEFAULT_HEIGHT,
  DEFAULT_QUALITY,
  DEFAULT_SCALE,
  DEFAULT_TYPE,
  DEFAULT_WIDTH,
  inputSchema,
} from "../api/screenshot/validation";

const defaultUrl = "https://bootpackdigital.com";

type Inputs = z.infer<typeof inputSchema>;

export const UrlBuilderForm = () => {
  const [generatedUrl, setGeneratedUrl] = useState(
    "Generate a URL to get started"
  );

  useEffect(() => {
    setGeneratedUrl(
      generateUrl({
        url: defaultUrl,
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
      url: defaultUrl,
    },
    mode: "onChange",
    resolver: zodResolver(inputSchema) as Resolver<Inputs>,
  });

  const generateUrl = (data: Inputs) => {
    const screenshotUrl = new URL(window.location.origin);
    screenshotUrl.pathname = "/api/screenshot";

    const parsedData = inputSchema.safeParse(data);
    if (!parsedData.success) {
      return "Invalid input detected";
    }

    const objectKeys = Object.keys(parsedData.data);

    objectKeys.forEach((key) => {
      if (parsedData.data[key as keyof Inputs]) {
        screenshotUrl.searchParams.set(
          key,
          parsedData.data[key as keyof Inputs]?.toString() || ""
        );
      }
    });

    if (parsedData.data?.type && parsedData.data.type === DEFAULT_TYPE) {
      screenshotUrl.searchParams.delete("type");
    }

    return screenshotUrl.toString();
  };

  const onSubmit: SubmitHandler<Inputs> = (data) => {
    setGeneratedUrl(generateUrl(data));
  };

  /* eslint-disable react-hooks/incompatible-library */
  const { url, key, width, height, scale, quality, fullPage, type } =
    methods.watch();
  /* eslint-enable react-hooks/incompatible-library */

  useEffect(() => {
    setGeneratedUrl(
      generateUrl({
        url,
        key,
        width,
        height,
        scale,
        quality,
        fullPage,
        type,
      })
    );
  }, [url, key, width, height, scale, quality, fullPage, type]);

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
            id="url"
            label="URL"
            placeholder="https://..."
            type="text"
            required
          />
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
            <InputField
              id="width"
              label="Width"
              min={1}
              placeholder={DEFAULT_WIDTH.toString()}
              type="number"
            />
            <InputField
              id="height"
              label="Height"
              min={1}
              placeholder={DEFAULT_HEIGHT.toString()}
              type="number"
            />
            <InputField
              id="scale"
              label="Scale"
              max={1}
              min={0.1}
              placeholder={DEFAULT_SCALE.toString()}
              step={0.1}
              type="number"
            />
            <SelectField
              id="type"
              label="Type"
              placeholder={DEFAULT_TYPE}
              options={[
                { label: "PNG", value: "png" },
                { label: "JPEG", value: "jpeg" },
                { label: "WebP", value: "webp" },
                { label: "AVIF", value: "avif" },
              ]}
            />
            <InputField
              id="quality"
              label="Quality"
              max={100}
              min={1}
              placeholder={DEFAULT_QUALITY.toString()}
              type="number"
            />
            <InputField label="Full Page" id="fullPage" type="checkbox" />
            <InputField
              className="sm:col-span-2"
              label="API Key"
              id="key"
              type="text"
              placeholder="your-api-key"
            />
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
    <div className={props.className}>
      <label className={styles.label} htmlFor={id}>
        {label}
      </label>
      <input
        id={id}
        {...props}
        className={
          props.type === "checkbox" ? styles.checkbox : styles.inputText
        }
        {...register(id)}
      />
      {errors[id] && (
        <span className={styles.error}>{errors[id]?.message}</span>
      )}
    </div>
  );
};

const SelectField = ({
  id,
  label,
  options,
  placeholder,
  ...props
}: {
  id: keyof Inputs;
  label: string;
  options: { label: string; value: string }[];
  placeholder: string;
} & React.SelectHTMLAttributes<HTMLSelectElement>) => {
  const { register } = useFormContext<Inputs>();

  return (
    <div className={props.className}>
      <label className={styles.label} htmlFor={id}>
        {label}
      </label>
      <select
        className={styles.inputText}
        id={id}
        {...register(id)}
        defaultValue={placeholder}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};

const styles = {
  label: "block text-sm font-medium mb-2",
  inputText: "block w-full border rounded-md p-2 appearance-none",
  checkbox:
    "inline-block my-1 size-8 appearance-none rounded-md border border-gray-300 ring-inset checked:bg-indigo-500 checked:border-2 checked:ring-3 checked:ring-white",
  error: "text-red-500 text-sm",
};
