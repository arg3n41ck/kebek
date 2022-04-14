# Install dependencies only when needed
FROM node:16-alpine AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app/kebek-admin-client
COPY package.json ./
RUN yarn install

# Rebuild the source code only when needed
FROM node:16-alpine AS builder
WORKDIR /app/kebek-admin-client
COPY . .
COPY --from=deps /app/kebek-admin-client/node_modules ./node_modules
RUN yarn build

# Production image, copy all the files and run next
FROM node:16-alpine AS runner
WORKDIR /app/kebek-admin-client

ENV NODE_ENV production


COPY --from=builder /app/kebek-admin-client/public ./public
COPY --from=builder /app/kebek-admin-client/src ./src
COPY --from=builder /app/kebek-admin-client/build ./build
COPY --from=builder /app/kebek-admin-client/node_modules ./node_modules
COPY --from=builder /app/kebek-admin-client/package.json ./package.json

EXPOSE 3001

CMD ["yarn", "start"]