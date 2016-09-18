#!/bin/bash
source /etc/apache2/envvars
exec apache2 -D FOREGROUND
rm /var/www/index.html
