$ npm i
$ npm run dev

or 

$ npm run build

while running the flask server in /server

setup:

$ python3.8 env venv
$ pip install flask gunicorn

then:

$ . ./env/bin/activate
$ gunicorn -w 4 server:app

or in root dir, run 

$ ./startup.sh