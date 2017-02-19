#!/bin/bash

hash-filename dist/*.css dist/*.js | map-replace -m "<[^>]+>" dist/*.html
