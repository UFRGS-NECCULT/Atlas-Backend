# pull official base image
FROM node:14-alpine

ENV CHROME_BIN="/usr/bin/chromium-browser"\
  PUPPETEER_SKIP_CHROMIUM_DOWNLOAD="true"

RUN apk add vim python python-dev py-pip build-base curl chromium htop ack

# set working directory
WORKDIR /app

# add `/app/node_modules/.bin` to $PATH
ENV PATH /app/node_modules/.bin:$PATH

# install app dependencies
COPY package.json ./
COPY package-lock.json ./
RUN npm install

# add app
COPY . ./

EXPOSE 8080

# start app
CMD ["npm", "run", "dev"]
