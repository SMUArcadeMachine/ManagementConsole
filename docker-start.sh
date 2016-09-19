#!/usr/bin/env bash
ids=$(docker ps -a -q)
if [[ $ids != "" ]]; then
    echo "Removing all old containers..."
    docker rm $ids -f;
fi
echo "Building images and creating containers..."
docker-compose up -d --build;