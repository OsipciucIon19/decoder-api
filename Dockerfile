FROM node:lts-alpine

# RUN mkdir -p /usr/src/app
WORKDIR /app

COPY package.json ./
RUN npm install --verbose

COPY . .

EXPOSE 3000
RUN npm run build

CMD [ "node", "dist/index.js" ]