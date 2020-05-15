# server setup

```
$ cd ./server
$ python3 -m venv env
$ pip install flask gunicorn
```

to run on port 8000:

```
$ . ./env/bin/activate
$ gunicorn -w 4 server:app
```

# client

Will run a dev server on 8080 proxied to the flask server

```
$ npm i
$ npm run server
$ npm run dev
```

## build:

Run server to host on 8000

```
$ npm run build
```

# quickstart from root dir once setup is done

```
$ npm run start-server
$ npm run start-dev
```
