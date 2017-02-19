#!/bin/bash

./bin/ws/prepare.sh

./bin/html/constants.sh

node-sass src/css/main.scss dist/main.css

webpack --config webpack.dev.js --watch & node bin/css/sass.js
