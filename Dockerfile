# pull official base image
FROM node:14-alpine

RUN apk add --no-cache \
  chromium \
  nss \
  freetype \
  harfbuzz \
  ca-certificates \
  ttf-freefont 

ENV CHROME_BIN="/usr/bin/chromium-browser"\
  PUPPETEER_SKIP_CHROMIUM_DOWNLOAD="true"

# set working directory
WORKDIR /app

# add `/app/node_modules/.bin` to $PATH
ENV PATH /app/node_modules/.bin:$PATH

# install app dependencies
COPY package.json ./
COPY package-lock.json ./
COPY yarn.lock ./
RUN yarn

RUN addgroup -S pptruser && adduser -S -g pptruser pptruser \
  && mkdir -p /home/pptruser/Downloads /app \
  && chown -R pptruser:pptruser /home/pptruser \
  && chown -R pptruser:pptruser /app

# add app
COPY . ./

EXPOSE 8080

# start app
CMD ["npm", "run", "dev"]
