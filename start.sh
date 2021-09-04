#!/bin/bash

cd $(dirname $0)

npm run migrate deploy && \
npm run seed && \
npm run start
