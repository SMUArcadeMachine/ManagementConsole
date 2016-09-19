#!/usr/bin/env bash
echo "Removing old container if there is one..."
docker rm -f smu-arcade-machine-management-console;
docker-compose up -d;