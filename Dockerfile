FROM node:12.13.0-alpine
RUN mkdir -p /usr/src/app/dist
WORKDIR /usr/src/app/
COPY package.json /usr/src/app/
RUN npm install
COPY ./dist/ /usr/src/app/dist
EXPOSE 3000
CMD [ "npm", "run", "prod" ]