FROM node:latest as build
WORKDIR /app/kebek-admin-client
COPY ./ ./
# install app dependencies

RUN yarn install
RUN yarn build


EXPOSE 3001
FROM nginx:stable-alpine
COPY --from=build /app/kebek-admin-client/build /usr/share/nginx/html
