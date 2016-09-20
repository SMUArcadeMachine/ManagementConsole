#!/bin/bash

base_build_str=toozick/smu-arcade-machine-management-console

build_types=(ember)

for item in "${build_types[@]}"
do
   :
   docker build -t ${base_build_str}-${item}:v1 -f docker_files/${item}/Dockerfile .
done
