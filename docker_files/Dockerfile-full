FROM ubuntu:12.04

MAINTAINER Preston Tighe

# Base run point
ENTRYPOINT ["/run.sh"]

ENV MYSQL_DATABASE SMUAdminConsole
ENV MYSQL_USER admin
ENV MYSQL_PASS 8043v36m807c3084m6m03v

# Updating repository
RUN apt-get -y update

# --------------------------------------------------------------------------LAMP--------------------------------------------------------------------------
# Install packages
RUN apt-get update && \
  apt-get -y install supervisor git apache2 libapache2-mod-php5 mysql-server php5-mysql pwgen php-apc php5-mcrypt && \
  echo "ServerName localhost" >> /etc/apache2/apache2.conf

# Add image configuration and scripts
ADD documentation/sql/database_setup.sql /database_setup.sql
ADD docker_files/*.sh /
RUN chmod 755 /*.sh
ADD docker_files/my.cnf /etc/mysql/conf.d/my.cnf
ADD docker_files/supervisord-apache2.conf /etc/supervisor/conf.d/supervisord-apache2.conf
ADD docker_files/supervisord-mysqld.conf /etc/supervisor/conf.d/supervisord-mysqld.conf

# Remove pre-installed database
RUN rm -rf /var/lib/mysql/*

# Add MySQL utils
ADD docker_files/create_mysql_admin_user.sh /create_mysql_admin_user.sh
RUN chmod 755 /*.sh

# Vim colors
ADD docker_files/vimrc.local /etc/vim/vimrc.local

# config to enable .htaccess
ADD docker_files/apache_default /etc/apache2/sites-available/default
RUN a2enmod rewrite

#Environment variables to configure php
ENV PHP_UPLOAD_MAX_FILESIZE 10M
ENV PHP_POST_MAX_SIZE 10M

# Add volumes for MySQL
VOLUME  ["/etc/mysql", "/var/lib/mysql" ]

# Expose MySQL port 3306
EXPOSE 3306

## --------------------------------------------------------------------------LAMP END--------------------------------------------------------------------------
#
## Essentials
RUN apt-get install -y curl wget build-essential python-software-properties python g++ make git-core libkrb5-dev vim ssh
#
## -----------------------------------------------------------------------PHP, APACHE--------------------------------------------------------------------------------
## PHP
RUN apt-get install -y php5-xdebug php5-curl
#
## XDebug config
ADD docker_files/xdebug.ini /etc/php5/conf.d/xdebug.ini
#
## Apache mods
RUN a2enmod rewrite
RUN a2enmod headers
RUN a2enmod ssl
#
## Apache restart after changes
RUN service apache2 restart
#
## PHP package manager
RUN curl -sS https://getcomposer.org/installer | php
RUN mv composer.phar /usr/local/bin/composer

# Remove default index.html file
RUN rm /var/www/index.html

# Expose Apache 80 port
EXPOSE 80

## -----------------------------------------------------------------------NODE--------------------------------------------------------------------------------
## Node JS w/ NPM
RUN curl -sL https://deb.nodesource.com/setup_4.x | bash -
RUN apt-get install -y nodejs
RUN npm set registry https://registry.npmjs.org/
RUN npm set progress=false

# Symlinks hack on vagrant
#sudo npm install -g sympm
#sudo sympm install

# Grunt, Bower, & Ember CLI
RUN npm install -g grunt-cli
RUN npm install -g bower
RUN npm install -g ember-cli

# Install Bower & NPM components
ADD ember-app /var/www/ember-app/
WORKDIR /var/www/ember-app
RUN bower install --allow-root --config.interactive=false
RUN npm install

# Ember addons
#sudo ember install ember-simple-auth

# Expose Ember server ports
EXPOSE 4200 35729

# Run database_setup.sql
