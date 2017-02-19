#!/bin/bash

html-minifier dist/index.html --output dist/index.tmp.html --remove-comments --html5 --collapse-whitespace 

mv dist/index.tmp.html dist/index.html
