FROM node:8-alpine

RUN echo "@community http://dl-4.alpinelinux.org/alpine/v3.6/community/" >> /etc/apk/repositories \
	&& apk add --update autossh@community \
	&& rm -rf /var/lib/apt/lists/*

COPY index.js package.json config /tunlr/
COPY lib/tunlr.js /tunlr/lib/

WORKDIR /tunlr
RUN npm install

CMD rm -rf /root/.ssh && \
    mkdir /root/.ssh && \
    cp -R /root/ssh/* /root/.ssh/ && \
    mv /tunlr/config /root/.ssh/ && \
    chmod -R 600 /root/.ssh/* && \
    node index.js help
