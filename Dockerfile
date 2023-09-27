FROM node:18

WORKDIR /usr/src/app

COPY package*.json /

RUN npm install

COPY . .

EXPOSE 5500

RUN npm run prsx
RUN npm run build

CMD [ "npm", "start" ]