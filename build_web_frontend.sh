#!/bin/bash
# Use this script to build the frontend without installing node.
docker run -ti \
  --rm \
  -e NODE_ENV=production \
  -v $PWD:/app \
  --user $(id -u):$(id -g) \
  node:14-alpine sh -c "cd /app; npm run-script build"
# Get the version number from package.json
PACKAGE_VERSION=$(grep -m1 version package.json | awk -F: '{ print $2 }' | sed 's/[", ]//g')
echo "Successfully built $PACKAGE_VERSION"
echo "You can now upload it to maja with the following command:"
echo "rsync -Phazv build/* maja:/data2/velthyding_releases/v$PACKAGE_VERSION"