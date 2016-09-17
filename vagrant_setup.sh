#!/bin/bash

## Updating repository
#
sudo apt-get -y update
#
## Installing MySQL and it's dependencies, Also, setting up root password for MySQL as it will prompt to enter the password during installation
#sudo debconf-set-selections <<< 'mysql-server-5.5 mysql-server/root_password password rootpass'
#sudo debconf-set-selections <<< 'mysql-server-5.5 mysql-server/root_password_again password rootpass'
#
## Essentials
sudo apt-get install -y curl wget build-essential python-software-properties python g++ make git-core libkrb5-dev vim ssh

# -----------------------------------------------------------------------SERVER, PHP--------------------------------------------------------------------------------
# Main lamp
sudo apt-get install -y lamp-server^

# Set root Apache folder to vagrant root folder
if ! [ -L /var/www ]; then
  rm -rf /var/www
  ln -fs /vagrant /var/www
fi

# PHP
sudo apt-get install -y php5-xdebug php5-curl

# XDebug config
cat << EOF | sudo tee -a /etc/php5/conf.d/xdebug.ini
zend_extension=/usr/lib/php5/20090626/xdebug.so
xdebug.scream=1
xdebug.cli_color=1
xdebug.show_local_vars=1
xdebug.idekey= PHPSTORM
xdebug.remote_autostart=1
xdebug.remote_enable=1
EOF

cat << EOF | sudo tee -a /etc/apache2/conf.d/xdebug.conf
ServerName localhost
EOF

# Apache mods
sudo a2enmod rewrite
sudo a2enmod headers
sudo a2enmod ssl

# PHP Config
sed -i "s/post_max_size = .*/post_max_size = 12M/" /etc/php5/apache2/php.ini
sed -i "s/upload_max_filesize = .*/upload_max_filesize = 10M/" /etc/php5/apache2/php.ini

sed -i 's/AllowOverride None/AllowOverride All/' /etc/apache2/apache2.conf

# Apache restart after changes
sudo service apache2 restart

# PHP package manager
curl -sS https://getcomposer.org/installer | php
sudo mv composer.phar /usr/local/bin/composer

# -----------------------------------------------------------------------NODE--------------------------------------------------------------------------------
# Node JS w/ NPM
curl -sL https://deb.nodesource.com/setup_4.x | sudo bash -
sudo apt-get install -y nodejs
npm set registry https://registry.npmjs.org/

# Symlinks hack on vagrant
#sudo npm install -g sympm
#sudo sympm install

# Grunt, Bower, & Ember CLI
#sudo npm install -g grunt-cli
#sudo npm install -g bower
#sudo npm install -g ember-cli

# Install Bower & NPM components
cd /vagrant/ember-app
#bower install
#sudo npm install

# Ember addons
#sudo ember install ember-simple-auth

# Run database_setup.sql

