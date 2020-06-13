FROM node:current-slim

WORKDIR /client
COPY /client/package.json .

RUN npm install
COPY ./client .
RUN npm run build

FROM python:3.7.3-slim

COPY requirements.txt .
COPY gunicorn_starter.sh .

WORKDIR /server
RUN pip3 install -r /requirements.txt

COPY /server /server

WORKDIR /client/public
COPY --from=0 /client/public .

WORKDIR /

ENTRYPOINT ["./gunicorn_starter.sh"]

EXPOSE 80
