FROM node:18

WORKDIR /app

COPY package.json .

RUN npm install

RUN npm i pm2 -g

COPY . .

EXPOSE 80

CMD ["pm2-runtime","src/backend/server.js"]