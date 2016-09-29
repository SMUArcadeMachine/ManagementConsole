#!/bin/bash

base_build_str=toozick/smu-arcade-machine-management-console

build_types=(php-apache ember)

for item in "${build_types[@]}"
do
   :
   docker build -t ${base_build_str}-${item}:v1 -f docker_files/${item}/Dockerfile .
    docker tag ${base_build_str}-${item}:v1 ${base_build_str}-${item}:v1
    docker push ${base_build_str}-${item}:v1
done
