#!/bin/bash

export NODE_PATH=$NODE_PATH:src:external

persistify src/app.js -o dist/bundle.js \
    --transform [ babelify --presets [ es2015 ] ] \
    --debug