FROM node:latest

WORKDIR /app

COPY package*.json ./

RUN npm install -g npm@latest

COPY . .

EXPOSE 5000

CMD ["npm", "start"]