FROM node:20-alpine

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm ci --omit=dev

COPY . .

EXPOSE 4009

ENV NODE_ENV=production

CMD ["node", "server.js"]
