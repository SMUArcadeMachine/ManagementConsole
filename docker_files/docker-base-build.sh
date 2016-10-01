#!/bin/bash

base_build_str=toozick/smu-arcade-machine-management-console

version=v2

build_types=(php-apache ember)


for item in "${build_types[@]}"
do
   :
   docker build -t ${base_build_str}-${item}:${version} -f docker_files/${item}/Dockerfile .
    docker tag ${base_build_str}-${item}:${version} ${base_build_str}-${item}:${version}
    docker push ${base_build_str}-${item}:${version}
done
