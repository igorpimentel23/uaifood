FROM node:15-alpine

RUN mkdir /app

WORKDIR /app

COPY package.json /app
COPY yarn.lock /app

RUN yarn

COPY . /app

RUN npx ts-node-dev src/index.ts

CMD ["yarn", "dev:server"]
