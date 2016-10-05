#!/usr/bin/env bash

#Production build script
#Copy all the Github repo to /var/wwww/html in production

#Install base packages
sudo apt-get -y install lamp-server^ vim wget git curl make bzip2 fontconfig autoconf automake clang g++ python-dev php5-curl php5-mysql

#Install Node 4.3.2 & NPM
wget https://nodejs.org/dist/v4.3.2/node-v4.3.2-linux-armv6l.tar.gz
tar -xvf node-v4.3.2-linux-armv6l.tar.gz
cd node-v4.3.2-linux-armv6l
sudo cp -R * /usr/local/

#Install Bower & Ember CLI
sudo npm install -g bower
sudo npm install -g ember-cli

#Install bower and node locally
cd /var/www/html/ember-app
sudo bower install --allow-root --config.interactive=false
sudo npm install

#PHP, Apache settings
sudo a2enmod rewrite
sudo a2enmod headers
sudo cp /var/www/html/docker_files/php-apache/apache_default /etc/apache2/sites-available/000-default.conf
sudo cp /var/www/html/documentation/production/apache2.conf /etc/apache2/apache2.conf
sudo chmod 777 /var/www/html/application/resources/EmailTemplates/compile
sudo service apache2 restart && sudo systemctl daemon-reload

#XDEBUG (optional - PHP debugger)
#sudo apt-get -y install php5-dev
#sudo cp /var/www/html/documentation/production/php-xdebug.ini /etc/php5/apache2/conf.d/php-xdebug.ini
#Install XDebug: docker_files/php-apache/Dockerfile
#Change your local IP in the documentation/production/php-xdebug.ini folder
#sudo service apache2 restart && sudo systemctl daemon-reload

#Run 192.168.1.7/cron/build_roms on the the backend to build all the ROMs from the system and put them in the DB

#Database
mysql -u root -praspberry SMUAdminConsole < /var/www/html/documentation/sql/database_setup.sql

#Build ROMs
sudo php index.php cron build_roms
