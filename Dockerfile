FROM node:14

RUN mkdir /home/app
COPY ./ /home/app
WORKDIR /home/app

RUN /bin/bash &&\
    apt-get -y update &&\
    apt-get -y upgrade &&\
    npm install

CMD npx ts-node index.ts
EXPOSE 80