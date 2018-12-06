FROM node:8-alpine

# RUN echo "@community http://dl-4.alpinelinux.org/alpine/v3.6/community/" >> /etc/apk/repositories \
# 	&& apk add --update autossh@community \
# 	&& rm -rf /var/lib/apt/lists/*
RUN apk add --update openssh-client && rm -rf /var/cache/apk/*

COPY index.js package.json /tunlr/
COPY lib/tunlr.js /tunlr/lib/
COPY config /tunlr/config
WORKDIR /tunlr
RUN npm install

COPY ssh /root/ssh

CMD rm -rf /root/.ssh && mkdir /root/.ssh && cp -R /root/ssh/* /root/.ssh/ && chmod -R 600 /root/.ssh/* && \
    node index.js help
