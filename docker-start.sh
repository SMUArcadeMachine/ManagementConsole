#!/usr/bin/env bash

#ipconfig | "C:\Program Files\Git\usr\bin\grep.exe" -E -i "IPv4" | "C:\Program Files\Git\usr\bin\grep.exe" -E -o "[0-9][0-9.]+" | "C:\Program Files\Git\usr\bin\grep.exe" -v  "192.168."


if [ -f docker_files/xdebug-local-ip.txt ]; then
    local_ip=$(cat docker_files/xdebug-local-ip.txt)
else
    echo "What is the local IP address of your machine (Windows: ipconfig - Mac: ifconfig) Ex. 10.0.0.39 - this is used to debug PHP in PHPStorm?"
    read local_ip
    echo ${local_ip} >> docker_files/xdebug-local-ip.txt
fi

echo "Using IP address $local_ip for debugging..."
cat docker-compose.yml | sed -e "s/<do_not_touch>/$local_ip/g" >> docker-compose-temp.yml

echo "Re/building images and re/creating containers..."
docker-compose -f docker-compose-temp.yml up -d --build --force-recreate;
rm docker-compose-temp.yml