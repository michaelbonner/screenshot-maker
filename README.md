# Screenshot Maker

Sometimes you just need to generate a few screenshots. Maybe you're visually comparing dev changes, maybe you want to put screenshots on another website. This project makes generating screenshots easier.

The app uses puppeteer to load a browser and take a screenshot. This app can be run on Vercel.

## Example URL

http://localhost:3000/api/screenshot?url=https%3A%2F%2Fbootpackdigital.com&width=1920&height=1080&scale=0.25&quality=50

## Query Args

| Name     | Type     | Description                                                                                      |
| -------- | -------- | ------------------------------------------------------------------------------------------------ |
| url      | string   | The URL of the page to screenshot                                                                |
| width    | number?  | The width of the screenshot                                                                      |
| height   | number?  | The height of the screenshot                                                                     |
| scale    | number?  | The scale of the screenshot. Helpful to get a desktop screenshot, but scaled down for rendering. |
| quality  | number?  | The quality of the screenshot                                                                    |
| fullPage | boolean? | Whether to take a full page screenshot                                                           |

## Getting Started

First, run the development server:

```bash
bun install
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Need some dev help?

Reach out to use at https://bootpackdigital.com. We're always happy to chat about projects and see if we can help.

<a href="https://bootpackdigital.com"><img src="https://bootpackdigital.com/og-image.jpg" alt="Bootpack Digital" /></a>
