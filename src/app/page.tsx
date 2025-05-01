import Link from "next/link";
import { UrlBuilderForm } from "./components/UrlBuilderForm";

const args = [
  {
    name: "url",
    type: "string",
    description: "The URL of the page to screenshot",
    default: "",
    required: true,
  },
  {
    name: "width",
    type: "number?",
    description: "The width of the viewport",
    default: 1920,
  },
  {
    name: "height",
    type: "number?",
    description: "The height of the viewport",
    default: 1080,
  },
  {
    name: "scale",
    type: "number?",
    description:
      "The scale of the screenshot. Helpful to get a desktop screenshot, but scaled down for rendering. Max 1.",
    default: 0.25,
  },
  {
    name: "quality",
    type: "number?",
    description: "The quality of the screenshot. Between 1-100.",
    default: 50,
  },
  {
    name: "fullPage",
    type: "boolean?",
    description: "Whether to take a full page screenshot",
    default: false,
  },
  {
    name: "key",
    type: "string?",
    description: "The API key to use for the screenshot",
    default: "",
  },
];

const url = "https://bootpackdigital.com";
const exampleUrl = new URL("http://localhost:3000/api/screenshot");
exampleUrl.searchParams.append("url", url);

export default function Home() {
  return (
    <div className="grid gap-24 min-h-screen p-8 pb-20 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="w-full max-w-7xl mx-auto grid gap-12 lg:gap-24">
        <h1 className="text-4xl lg:text-6xl font-bold">Screenshot Maker</h1>
        <div className="w-full grid gap-8 lg:gap-16 [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:mb-4 [&_h3]:text-xl [&_h3]:font-bold [&_h3]:mb-2">
          <div>
            <h2>Basic Example</h2>
            <div>
              <code className="block text-sm border p-4">
                <Link
                  className="underline underline-offset-4"
                  href={exampleUrl.toString()}
                  target="_blank"
                >
                  {exampleUrl.toString()}
                </Link>
              </code>
            </div>
          </div>
          <div>
            <h2>Args</h2>
            <table className="w-full border-collapse border border-gray-300 [&_td]:p-2 [&_th]:p-2 [&_th]:border [&_td]:border dark:[&_th]:border-gray-300 dark:[&_td]:border-gray-300">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Type</th>
                  <th>Default</th>
                  <th>Description</th>
                </tr>
              </thead>
              <tbody>
                {args.map((arg) => (
                  <tr key={arg.name}>
                    <td>{arg.name}</td>
                    <td>
                      <code>{arg.type}</code>
                    </td>
                    <td>
                      <code>{arg.default.toString()}</code>
                    </td>
                    <td>{arg.description}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div>
            <h2>URL Builder</h2>
            <UrlBuilderForm />
          </div>
          <div>
            <h2>
              <svg
                className="inline-block mb-1 mr-2 size-5 dark:text-gray-100"
                width="1024"
                height="1024"
                viewBox="0 0 1024 1024"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M8 0C3.58 0 0 3.58 0 8C0 11.54 2.29 14.53 5.47 15.59C5.87 15.66 6.02 15.42 6.02 15.21C6.02 15.02 6.01 14.39 6.01 13.72C4 14.09 3.48 13.23 3.32 12.78C3.23 12.55 2.84 11.84 2.5 11.65C2.22 11.5 1.82 11.13 2.49 11.12C3.12 11.11 3.57 11.7 3.72 11.94C4.44 13.15 5.59 12.81 6.05 12.6C6.12 12.08 6.33 11.73 6.56 11.53C4.78 11.33 2.92 10.64 2.92 7.58C2.92 6.71 3.23 5.99 3.74 5.43C3.66 5.23 3.38 4.41 3.82 3.31C3.82 3.31 4.49 3.1 6.02 4.13C6.66 3.95 7.34 3.86 8.02 3.86C8.7 3.86 9.38 3.95 10.02 4.13C11.55 3.09 12.22 3.31 12.22 3.31C12.66 4.41 12.38 5.23 12.3 5.43C12.81 5.99 13.12 6.7 13.12 7.58C13.12 10.65 11.25 11.33 9.47 11.53C9.76 11.78 10.01 12.26 10.01 13.01C10.01 14.08 10 14.94 10 15.21C10 15.42 10.15 15.67 10.55 15.59C13.71 14.53 16 11.53 16 8C16 3.58 12.42 0 8 0Z"
                  transform="scale(64)"
                  fill="currentColor"
                />
              </svg>
              GitHub Repo
            </h2>
            <p>
              <a
                className="underline underline-offset-4"
                href="https://github.com/michaelbonner/screenshot-maker"
              >
                Learn more about the screenshot generator on the GitHub repo
              </a>
            </p>
          </div>
        </div>
      </main>
      <footer className="w-full max-w-7xl mx-auto">
        <p className="text-sm">
          ©2023-{new Date().getFullYear()}{" "}
          <a
            className="underline underline-offset-4"
            href="https://bootpackdigital.com"
          >
            Bootpack Digital
          </a>
          . All rights reserved.
        </p>
      </footer>
    </div>
  );
}
