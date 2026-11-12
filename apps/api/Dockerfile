# Production image for the rumahkodingku-academy API.
# Build from the repository root so workspace packages resolve:
#   docker build -f apps/api/Dockerfile .

FROM node:24-slim AS base
RUN corepack enable
WORKDIR /app

FROM base AS builder
COPY . .
RUN pnpm install --frozen-lockfile --dangerously-allow-all-builds
RUN pnpm --filter api build

# Production dependencies of the API workspace, without dev dependencies.
FROM base AS deps
COPY . .
# The workspaces' own install scripts (Git hook setup, codegen) need dev tools
# that this stage leaves out. The builder stage already ran them, and the runner
# takes what they produced from there, so drop them here.
RUN node -e 'const fs = require("fs"); \
  const dirs = ["apps", "packages"].filter((root) => fs.existsSync(root)) \
    .flatMap((root) => fs.readdirSync(root).map((name) => root + "/" + name)); \
  for (const dir of [".", ...dirs]) { \
    const file = dir + "/package.json"; \
    if (!fs.existsSync(file)) continue; \
    const pkg = JSON.parse(fs.readFileSync(file, "utf8")); \
    for (const name of ["preinstall", "install", "postinstall", "preprepare", "prepare", "postprepare"]) delete pkg.scripts?.[name]; \
    fs.writeFileSync(file, JSON.stringify(pkg, null, 2)); \
  }'
RUN pnpm install --prod --frozen-lockfile --dangerously-allow-all-builds --filter "api..."
RUN mkdir -p apps/api/node_modules

FROM node:24-slim AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=3000
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/apps/api/node_modules ./apps/api/node_modules
COPY --from=builder /app/apps/api/package.json ./apps/api/package.json
COPY --from=builder /app/apps/api/dist ./apps/api/dist
COPY --from=builder /app/apps/api/src/mail/templates ./apps/api/src/mail/templates
WORKDIR /app/apps/api
EXPOSE 3000
CMD ["node", "dist/index.mjs"]
