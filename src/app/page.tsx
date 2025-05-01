import Link from "next/link";

const args = [
  {
    name: "url",
    type: "string",
    description: "The URL of the page to screenshot",
    required: true,
  },
  {
    name: "width",
    type: "number?",
    description: "The width of the screenshot",
  },
  {
    name: "height",
    type: "number?",
    description: "The height of the screenshot",
  },
  {
    name: "scale",
    type: "number?",
    description:
      "The scale of the screenshot. Helpful to get a desktop screenshot, but scaled down for rendering.",
  },
  {
    name: "quality",
    type: "number?",
    description: "The quality of the screenshot",
  },
  {
    name: "fullPage",
    type: "boolean?",
    description: "Whether to take a full page screenshot",
  },
];

export default function Home() {
  return (
    <div className="grid gap-24 min-h-screen p-8 pb-20 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="max-w-7xl mx-auto grid gap-12">
        <h1 className="text-4xl font-bold">Screenshot Maker</h1>
        <div className="grid gap-8 [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:mb-4">
          <div>
            <h2>Example</h2>
            <div>
              <code className="block text-sm border rounded-md p-4">
                <Link
                  className="underline underline-offset-4"
                  href="http://localhost:3000/api/screenshot?url=https%3A%2F%2Fbootpackdigital.com&width=1920&height=1080&scale=0.25&quality=50"
                  target="_blank"
                >
                  http://localhost:3000/api/screenshot?url=https%3A%2F%2Fbootpackdigital.com&width=1920
                  <wbr />
                  &height=1080
                  <wbr />
                  &scale=0.25
                  <wbr />
                  &quality=50
                </Link>
              </code>
            </div>
          </div>
          <div>
            <h2>Args</h2>
            <table className="w-full border-collapse border border-gray-300 [&_td]:p-2 [&_th]:p-2 [&_th]:border [&_td]:border [&_th]:border-gray-300">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Type</th>
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
                    <td>{arg.description}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div>
            <h2>GitHub Repo</h2>
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
      <footer className="max-w-7xl mx-auto">
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
