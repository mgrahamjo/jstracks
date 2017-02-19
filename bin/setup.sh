#!/bin/bash

. ./bin/util.sh

cd_to_root

if missing brew; then
  /usr/bin/ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"
fi

if missing git; then
  brew install git
fi

if missing node; then
  brew install node
fi

if missing yarn; then
  brew install yarn
fi

yarn

npm run build
