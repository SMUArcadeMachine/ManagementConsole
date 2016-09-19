FROM ubuntu:12.04
MAINTAINER Preston Tighe

ENV PHP_UPLOAD_MAX_FILESIZE 10M
ENV PHP_POST_MAX_SIZE 10M

VOLUME ["/var/www"]

## Install
RUN apt-get update
RUN apt-get install -y \
      curl \
      supervisor \
      apache2 \
      libapache2-mod-php5 \
      php5-mysql \
      pwgen \
      php5-xdebug \
      php5-curl

# echo "ServerName localhost" >> /etc/apache2/apache2.conf

# Apache mods
RUN a2enmod rewrite
RUN a2enmod headers
RUN a2enmod ssl

# Apache config
COPY docker_files/php-apache/apache_default /etc/apache2/sites-available/default

# Supervisor
COPY docker_files/php-apache/supervisord.conf /etc/supervisor/conf.d/supervisord.conf

# Vim colors
COPY docker_files/php-apache/vimrc.local /etc/vim/vimrc.local

# XDebug config
COPY docker_files/php-apache/xdebug.ini /etc/php5/conf.d/xdebug.ini

# PHP config
RUN sed -ri -e "s/^upload_max_filesize.*/upload_max_filesize = ${PHP_UPLOAD_MAX_FILESIZE}/" \
        -e "s/^post_max_size.*/post_max_size = ${PHP_POST_MAX_SIZE}/" /etc/php5/apache2/php.ini


# PHP package manager
RUN curl -sS https://getcomposer.org/installer | php
RUN mv composer.phar /usr/local/bin/composer

# Apache2 port
EXPOSE 80

# Main run script
COPY docker_files/php-apache/run.sh /run.sh
RUN chmod 755 /*.sh
ENTRYPOINT ["/run.sh"]