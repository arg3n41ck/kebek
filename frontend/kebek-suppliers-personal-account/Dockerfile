FROM node:latest as build
WORKDIR /app/kebek-suppliers-personal-account
COPY ./ ./


RUN yarn install
RUN yarn build

EXPOSE 3002


CMD ["yarn", "start"]
