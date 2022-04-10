#!/usr/bin/env bash

npm run build

if [ -d "build" ]; then
  rm -r build
fi

if [ -d "target" ]; then
  rm -r target
fi


mkdir build
mkdir build/src
mkdir target

cp -r dist icons build
cp src/calofree.{html,css} build/src
cp manifest.json build
cd build
zip -r ../target/calofree.xpi *
cd ..
