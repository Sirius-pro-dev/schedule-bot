FROM node:18.18.0

WORKDIR /schedule-bot

COPY package.json .
COPY package-lock.json .
RUN npm ci

COPY . .

EXPOSE 8999

CMD ["npm", "start"]