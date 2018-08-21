#!/usr/bin/env bash
# set -e

if [ "$1" = 'dev' ]
then

    yarn install
    yarn run serve

elif [ "$1" = 'prod' ]
then

    yarn install
    yarn run serve:prod

elif [ "$1" = 'test' ]
then

    yarn install
    yarn run test:unit

elif [ "$1" = 'build' ]
then

    yarn install
    yarn run build

else

    exec "$@"

fi
