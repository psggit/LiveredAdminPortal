FROM node:8.11.2

RUN mkdir -p /app
WORKDIR /app

COPY package.json .
RUN yarn install

COPY ./ /app

# ENV NODE_PATH /app/node_modules/
# ENV NODE_PATH /usr/lib/node_modules/

RUN yarn run build

ENTRYPOINT ["yarn", "run", "start"]