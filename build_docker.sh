#!/bin/bash
# Use this script to build a docker image for velthyding
PACKAGE_VERSION=$(grep -m1 version package.json | awk -F: '{ print $2 }' | sed 's/[", ]//g')
docker build -t docker.greynir.is/velthyding:$PACKAGE_VERSION .