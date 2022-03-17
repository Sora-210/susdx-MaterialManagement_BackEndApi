FROM node:14

RUN mkdir /home/app
COPY ./ /home/app
WORKDIR /home/app

RUN /bin/bash &&\
    apt-get -y update &&\
    apt-get -y upgrade &&\
    npm install

CMD npm run serve
EXPOSE 80