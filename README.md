# Screenshot Maker

Sometimes you just need to generate a few screenshots. Maybe you're visually comparing dev changes, maybe you want to put screenshots on another website. This project makes generating screenshots easier.

The app uses puppeteer to load a browser and take a screenshot. This app can be run on Vercel.

## Example URL

http://localhost:3000/api/screenshot?url=https%3A%2F%2Fbootpackdigital.com&width=1920&height=1080&scale=0.25&quality=50

## Query Args

| Name     | Type     | Default | Description                                                                                             |
| -------- | -------- | ------- | ------------------------------------------------------------------------------------------------------- |
| url      | string   |         | The URL of the page to screenshot.                                                                      |
| width    | number?  | 1920    | The width of the viewport.                                                                              |
| height   | number?  | 1080    | The height of the viewport.                                                                             |
| scale    | number?  | 0.25    | The scale of the screenshot. Helpful to get a desktop screenshot, but scaled down for rendering. Max 1. |
| quality  | number?  | 50      | The quality of the screenshot. Between 1-100.                                                           |
| fullPage | boolean? | false   | Whether to take a full page screenshot.                                                                 |

## Getting Started

Copy the .env.example to .env.local and adjust the values to your needs.

```bash
cp .env.example .env.local
```

Run the development server:

```bash
bun install
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You probably don't want to have this open to the public. To see the authentication methods check out the `.env.example`. You can
lock it down by referrer, by API key, or bypass it altogether when testing locally.

## Need some dev help?

Reach out to use at https://bootpackdigital.com. We're always happy to chat about projects and see if we can help.

<a href="https://bootpackdigital.com"><img src="https://bootpackdigital.com/og-image.jpg" alt="Bootpack Digital" /></a>
