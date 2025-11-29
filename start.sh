#!/usr/bin/env bash
set -e

# move into backend and start it
cd backend

# install if needed (Railway may already run install; safe to keep)
if [ -f package.json ]; then
  npm install --silent
fi

# start the server
npm start
