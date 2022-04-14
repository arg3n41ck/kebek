# Install dependencies only when needed
FROM node:16-alpine AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app/kebek
COPY package.json yarn.lock  ./
RUN yarn install --frozen-lockfile

# Rebuild the source code only when needed
FROM node:16-alpine AS builder
WORKDIR /app/kebek
COPY . .
COPY --from=deps /app/kebek/node_modules ./node_modules
RUN yarn build

# Production image, copy all the files and run next
FROM node:16-alpine AS runner
WORKDIR /app/kebek

ENV NODE_ENV production

RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001

# You only need to copy next.config.js if you are NOT using the default configuration
COPY --from=builder /app/kebek/next.config.js ./
COPY --from=builder /app/kebek/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/kebek/.next ./.next
COPY --from=builder /app/kebek/node_modules ./node_modules
COPY --from=builder /app/kebek/package.json ./package.json

USER nextjs

EXPOSE 3000

CMD ["yarn", "start"]
