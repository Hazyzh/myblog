FROM node

RUN mkdir /home/app

WORKDIR /home/app

COPY ./ /home/app

RUN npm i cnpm -g \
    && cnpm i \
    && cnpm i pm2 -g

CMD ["pm2", "start", "index.js"]

EXPOSE 8080
