FROM node:latest as build
WORKDIR /app/kebek-admin-client
COPY ./ ./
# install app dependencies

RUN yarn install
RUN yarn build


EXPOSE 3001

CMD ["yarn", "start"]
