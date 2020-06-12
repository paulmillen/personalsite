#!/bin/bash

gunicorn --chdir server server:app -w 4 -b 0.0.0.0:8000