# FROM debian:jessie
FROM php:5.6-apache

MAINTAINER Preston Tighe

## Install
RUN apt-get update

# Apache server name
RUN echo "ServerName localhost" >> /etc/apache2/apache2.conf

# Vim
RUN apt-get -y install vim wget git
COPY docker_files/php-apache/vimrc.local /etc/vim/vimrc.local

# Apache mods
RUN a2enmod rewrite
RUN a2enmod headers
RUN a2enmod ssl

# Apache config
COPY docker_files/php-apache/apache_default /etc/apache2/sites-available/default

# PHP config
#RUN sed -ri -e "s/^upload_max_filesize.*/upload_max_filesize = 10M/" \
#        -e "s/^post_max_size.*/post_max_size = 10M/" /etc/php5/apache2/php.ini


# PHP package manager
RUN curl -sS https://getcomposer.org/installer | php
RUN mv composer.phar /usr/local/bin/composer

# XDebug
WORKDIR /tmp
RUN wget http://xdebug.org/files/xdebug-2.4.1.tgz
RUN tar -xvzf xdebug-2.4.1.tgz
WORKDIR xdebug-2.4.1
RUN phpize
RUN ./configure
RUN make
RUN cp modules/xdebug.so /usr/local/lib/php/extensions/no-debug-non-zts-20131226
COPY docker_files/php-apache/xdebug.ini /usr/local/etc/php/php.ini
RUN touch /var/log/xdebug.log
RUN chown www-data:www-data /var/log/xdebug.log
RUN chmod 777 /var/log/xdebug.log

EXPOSE 9000

WORKDIR /var/www/html