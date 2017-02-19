#!/bin/bash

. ./bin/util.sh

### Prepare workspace ###
./bin/ws/prepare.sh

########## JavaScript ##########

### lint ###
attempt eslint
eslint "src/**/*.js" && success || fail

### transpile ###
attempt webpack
webpack --config webpack.prod.js && success || fail

############# CSS #############

### compile ###
attempt sass
node-sass src/css/main.scss dist/main.css --quiet && success || fail

### autoprefix ###
attempt autoprefix
postcss --use autoprefixer dist/main.css --replace && success || fail

### minify ###
attempt cleancss
cleancss -o dist/main.css dist/main.css && success || fail

############# HTML #############

### Insert constants ##
attempt constants
./bin/html/constants.sh && success || fail

### Minify HTML ###
attempt html-minifier
./bin/html/minify.sh && success || fail

### Hash filenames ###
attempt hash-filename
./bin/html/hash-filename.sh && success || fail

### Clean up temp files ###
rm dist/bundle.js dist/main.css
