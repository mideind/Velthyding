#!/bin/bash
yarn build
# Get the version number from package.json
PACKAGE_VERSION=$(grep -m1 version package.json | awk -F: '{ print $2 }' | sed 's/[", ]//g')
echo "Successfully built $PACKAGE_VERSION"
echo "You can now upload it to maja with the following command:"
echo "rsync -Phazv build/* maja:/data2/velthyding_releases/v$PACKAGE_VERSION"
