#!/bin/bash

cd client && npm run dev

cd ../server &&
. ./env/bin/activate && gunicorn -w 4 server:app
