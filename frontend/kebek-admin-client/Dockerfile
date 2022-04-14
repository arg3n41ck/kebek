# Install dependencies only when needed
FROM node:alpine AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app/kebek-admin-client
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

# Rebuild the source code only when needed
FROM node:alpine AS builder
WORKDIR /app/kebek-admin-client
COPY . .
COPY --from=deps /app/kebek-admin-client/node_modules ./node_modules
RUN yarn build

# Production image, copy all the files and run next
FROM node:alpine AS runner
WORKDIR /app/kebek-admin-client

ENV NODE_ENV production

RUN addgroup -g 1001 -S nodejs1
RUN adduser -S reactjs1 -u 1001

# You only need to copy next.config.js if you are NOT using the default configuration
COPY --from=builder /app/kebek-admin-client/public ./public
COPY --from=builder --chown=reactjs1:nodejs1 /app/kebek-admin-client/.build ./.build
COPY --from=builder /app/kebek-admin-client/node_modules ./node_modules
COPY --from=builder /app/kebek-admin-client/package.json ./package.json

USER reactjs1

EXPOSE 3001

CMD ["yarn", "start"]