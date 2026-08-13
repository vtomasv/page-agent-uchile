# Page Agent · Archivo editorial cívico — reproducible static runtime.
# Multi-stage build: Node only exists during build; the final image is Nginx static hosting.

FROM node:22-alpine AS build

WORKDIR /app
ENV COREPACK_ENABLE_DOWNLOAD_PROMPT=0

COPY package.json pnpm-lock.yaml ./
COPY patches ./patches
RUN corepack enable && pnpm install --frozen-lockfile

COPY . .
RUN pnpm check && pnpm build

FROM nginx:1.27-alpine AS runtime

LABEL org.opencontainers.image.title="Page Agent · Educación Continua DCC"
LABEL org.opencontainers.image.description="Frontend-only Page Agent prototype with local browser inference harness"

COPY --from=build /app/dist/public /usr/share/nginx/html
COPY docker/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --spider --quiet http://127.0.0.1/ || exit 1

ENTRYPOINT ["nginx", "-g", "daemon off;"]
