FROM node:0.12

MAINTAINER cayle@nimbustech.biz

RUN npm install -g apigee-127
RUN mkdir /var/app
WORKDIR /var/app
RUN npm install volos-redis-manager-cli && \
    ln -s node_modules/volos-redis-manager-cli/manage.js
RUN a127 project create approot
ENV A127_APPROOT /var/app/approot
VOLUME /var/app/approot

CMD node manage.js --help
