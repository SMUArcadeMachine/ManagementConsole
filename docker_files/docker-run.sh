#!/usr/bin/env bash

docker rm $(docker ps -a -q) -f
docker run -d --name smu-arcade-machine-management-console \
    -p 8080:80 \
    -v C:\Users\PrestonSSD2\PhpstormProjects\ManagementConsole:/var/www/html \
    toozick/smu-arcade-machine-management-console:v1
