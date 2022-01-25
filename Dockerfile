FROM node:14.17.4-alpine

WORKDIR /portfolios-project

COPY ./package*.json /portfolios-project/

RUN npm install glob rimraf

RUN npm install

COPY . /portfolios-project/

RUN npm run build
