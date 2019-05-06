FROM node:10.14.1

RUN mkdir -p /app
WORKDIR /app

COPY package.json .
RUN npm rebuild
RUN npm install --build-from-source

COPY ./ /app

# ENV NODE_PATH /app/node_modules/
# ENV NODE_PATH /usr/lib/node_modules/

RUN npm run build

ENTRYPOINT ["npm", "run", "start"]
