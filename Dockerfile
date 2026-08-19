# syntax=docker/dockerfile:1

# =====================================================================
# Production image for Screenshot Maker.
#
# Built in GitHub Actions (see .github/workflows/deploy.yml) and pushed to
# GHCR; Dokploy only pulls and runs it. Previously Dokploy built this on the
# production box with nixpacks — and this is the app that hurt most, because
# every deploy also downloaded a Chromium build onto the live server.
#
# Dependencies are installed with bun, because bun.lock is the source of truth
# for this repo. The build and the server then run on Node: bun segfaults
# inside `next build` for some of these apps, and Node is what Next targets.
#
# Unlike the other Next apps here this one does NOT use `output: "standalone"`.
# Playwright resolves its browser through its own package layout at runtime, so
# the image keeps a real node_modules and runs `next start`. Chromium dominates
# the image size either way.
#
# Both Node stages resolve one ARG so they cannot drift apart, and so there is
# a single place to pin a digest.
# =====================================================================
ARG BUN_IMAGE=oven/bun:1
ARG NODE_IMAGE=node:22-slim

FROM ${BUN_IMAGE} AS dependencies
WORKDIR /app

# --ignore-scripts deliberately skips this repo's postinstall
# (`bunx playwright install chromium --with-deps`). Browsers are installed once
# in the runtime stage instead, so the build stage stays lean and the browser
# never ends up in two layers.
COPY package.json bun.lock ./
RUN bun install --frozen-lockfile --ignore-scripts

FROM ${NODE_IMAGE} AS build
WORKDIR /app
COPY --from=dependencies /app/node_modules ./node_modules
COPY . .

# Nothing in this app reads a secret at import time, so the build needs no
# placeholder env — it has no database and no auth.
RUN npm run build

# =====================================================================
# Browser runtime base
# =====================================================================
FROM ${NODE_IMAGE} AS browser
WORKDIR /app

ENV NODE_ENV=production \
    HOSTNAME=0.0.0.0 \
    PORT=3000 \
    PLAYWRIGHT_BROWSERS_PATH=/ms-playwright

COPY --from=dependencies /app/node_modules ./node_modules

# Install the Chromium build that matches the Playwright version resolved in
# bun.lock, rather than pinning a browser image tag that would silently drift
# out of sync the next time playwright is bumped. --with-deps pulls the shared
# libraries headless Chromium needs on a slim base. This stage deliberately has
# no build output: application-only changes can reuse the large browser layer.
RUN npx --yes playwright install --with-deps chromium \
    && rm -rf /var/lib/apt/lists/* \
    && chown -R node:node /app /ms-playwright

# =====================================================================
# Runtime
# =====================================================================
FROM browser AS runtime

COPY --from=build /app/.next ./.next
# No `public/` here: the directory exists locally but is untracked, so it does
# not exist in a clean checkout and a COPY of it fails the build in CI.
COPY --from=build /app/package.json ./package.json
COPY --from=build /app/next.config.ts ./next.config.ts

# Root was only needed for the apt install above. Chromium is launched with
# --no-sandbox (see src/app/api/screenshot/helpers.ts), which is what lets it
# run unprivileged here.
USER node

EXPOSE 3000

# `next start`, the same thing nixpacks ran. This app has no database, so there
# is nothing to migrate on boot.
CMD ["npx", "next", "start"]
