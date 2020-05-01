#!/bin/bash

cd client && npm run build-dev

cd ../server &&
. ./env/bin/activate && gunicorn -w 4 server:app
