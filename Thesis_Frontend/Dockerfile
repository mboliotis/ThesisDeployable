FROM node:22-alpine3.19

WORKDIR /usr/src/thesis

COPY ./thesis_frontend .

WORKDIR /usr/src/thesis/thesis_frontend 

RUN npm install

EXPOSE 3000

CMD npm run dev