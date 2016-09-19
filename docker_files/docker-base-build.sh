#!/usr/bin/env bash

docker build -t toozick/smu-arcade-machine-management-console:v1 -f docker_files/php-apache/Dockerfile .
docker tag toozick/smu-arcade-machine-management-console:v1 toozick/smu-arcade-machine-management-console:v1
docker push toozick/smu-arcade-machine-management-console:v1