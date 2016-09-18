FROM ubuntu:12.04

MAINTAINER Preston Tighe

ENV MYSQL_USER admin
ENV MYSQL_PASS 8043v36m807c3084m6m03v

## Updating repository
#
RUN apt-get -y update
# --------------------------------------------------------------------------LAMP--------------------------------------------------------------------------
# Install packages
RUN apt-get update && \
  apt-get -y install supervisor git apache2 libapache2-mod-php5 mysql-server php5-mysql pwgen php-apc php5-mcrypt && \
  echo "ServerName localhost" >> /etc/apache2/apache2.conf

# Add image configuration and scripts
ADD documentation/sql/database_setup.sql /database_setup.sql
ADD docker_files/start-apache2.sh /start-apache2.sh
ADD docker_files/start-mysqld.sh /start-mysqld.sh
ADD docker_files/run.sh /run.sh
RUN chmod 755 /*.sh
ADD docker_files/my.cnf /etc/mysql/conf.d/my.cnf
ADD docker_files/supervisord-apache2.conf /etc/supervisor/conf.d/supervisord-apache2.conf
ADD docker_files/supervisord-mysqld.conf /etc/supervisor/conf.d/supervisord-mysqld.conf

# Remove pre-installed database
RUN rm -rf /var/lib/mysql/*

# Add MySQL utils
ADD docker_files/create_mysql_admin_user.sh /create_mysql_admin_user.sh
RUN chmod 755 /*.sh

# config to enable .htaccess
ADD docker_files/apache_default /etc/apache2/sites-available/000-default.conf
RUN a2enmod rewrite

# Configure /app folder with sample app
#RUN git clone https://github.com/fermayo/hello-world-lamp.git /app
#RUN mkdir -p /app && rm -fr /var/www/html && ln -s /app /var/www/html

#Environment variables to configure php
ENV PHP_UPLOAD_MAX_FILESIZE 10M
ENV PHP_POST_MAX_SIZE 10M

# Add volumes for MySQL
VOLUME  ["/etc/mysql", "/var/lib/mysql" ]

EXPOSE 80 3306
ENTRYPOINT ["/run.sh"]

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
#
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
#cd /vagrant/ember-app
#bower install
#sudo npm install

# Ember addons
#sudo ember install ember-simple-auth

# Run database_setup.sql
