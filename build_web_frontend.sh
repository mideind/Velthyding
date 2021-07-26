#!/bin/bash
# Use this script to build the project without installing node.
docker run -ti \
  --rm \
  -e NODE_ENV=production \
  -v $PWD:/app \
  --user $(id -u):$(id -g) \
  node:14-alpine sh -c "cd /app; npm run-script build"