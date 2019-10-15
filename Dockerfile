FROM node:10.16.0-alpine

MAINTAINER Samuel <samuelagm@gmail.com>

# Expose ports
EXPOSE 80 443 1337

ADD . .

RUN npm install

CMD ["npm", "start"]