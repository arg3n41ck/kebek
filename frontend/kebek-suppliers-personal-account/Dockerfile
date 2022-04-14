FROM node:latest as build
WORKDIR /app/kebek-suppliers-personal-account
COPY ./ ./


RUN yarn install
RUN yarn build

EXPOSE 3002
FROM nginx:stable-alpine
COPY --from=build /app/kebek-suppliers-personal-account/build /usr/share/nginx/html
