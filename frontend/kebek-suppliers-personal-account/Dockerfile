FROM node:alpine AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app/kebek-suppliers-personal-account
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile


# Rebuild the source code only when needed
FROM node:alpine AS builder
WORKDIR /app/kebek-suppliers-personal-account
COPY . .
COPY --from=deps /app/kebek-suppliers-personal-account/node_modules ./node_modules
RUN yarn build

# Production image, copy all the files and run next
FROM node:alpine AS runner
WORKDIR /app/kebek-suppliers-personal-account

ENV NODE_ENV production

RUN addgroup -g 1001 -S nodejs2
RUN adduser -S reactjs2 -u 1001
RUN mkdir /app/kebek-suppliers-personal-account/.build

# You only need to copy next.config.js if you are NOT using the default configuration
COPY --from=builder /app/kebek-suppliers-personal-account/public ./public
COPY --from=builder --chown=reactjs2:nodejs2 /app/kebek-suppliers-personal-account/build ./build
COPY --from=builder /app/kebek-suppliers-personal-account/node_modules ./node_modules
COPY --from=builder /app/kebek-suppliers-personal-account/package.json ./package.json

USER reactjs2

EXPOSE 3002

CMD ["yarn", "start"]