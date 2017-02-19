#!/bin/bash

# Escapes forward slashes
escape() {
    echo $1 | sed -e 's,/,\\/,g'
}

insert() {
    HTML=$(echo "$HTML" | perl -p0e "s/<!--insert:$1-->/$2/s" )
}

HTML=$(cat src/index.html)

# This is where you would get constants from the environment or a database
API_URL="https://jsonplaceholder.typicode.com"
# Add an insert call for each constant
insert "apiURL" $(escape "$API_URL")

echo "$HTML" > dist/index.html

if grep -q -e "$TILE_URL" dist/index.html; then
    exit 0
else 
    exit 1
fi
