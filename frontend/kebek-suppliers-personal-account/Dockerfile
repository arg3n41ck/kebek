# Install dependencies only when needed
FROM node:16-alpine AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app/kebek-suppliers-personal-account
COPY package.json ./
RUN yarn install

# Rebuild the source code only when needed
FROM node:16-alpine AS builder
WORKDIR /app/kebek-suppliers-personal-account
COPY . .
COPY --from=deps /app/kebek-suppliers-personal-account/node_modules ./node_modules
RUN yarn build

# Production image, copy all the files and run next
FROM node:16-alpine AS runner
WORKDIR /app/kebek-suppliers-personal-account

ENV NODE_ENV production


COPY --from=builder /app/kebek-suppliers-personal-account/public ./public
COPY --from=builder /app/kebek-suppliers-personal-account/src ./src
COPY --from=builder /app/kebek-suppliers-personal-account/build ./build
COPY --from=builder /app/kebek-suppliers-personal-account/node_modules ./node_modules
COPY --from=builder /app/kebek-suppliers-personal-account/package.json ./package.json

EXPOSE 3002

CMD ["yarn", "start"]