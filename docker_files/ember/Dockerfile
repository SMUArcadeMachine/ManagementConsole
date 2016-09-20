FROM ubuntu:12.04

MAINTAINER Preston Tighe

## Install
RUN apt-get update

# Vim
RUN apt-get -y install vim wget git curl
COPY docker_files/php-apache/vimrc.local /etc/vim/vimrc.local

# -----------------------------------------------------------------------NODE--------------------------------------------------------------------------------
# Node JS w/ NPM
RUN curl -sL https://deb.nodesource.com/setup_4.x | bash -
RUN apt-get install -y nodejs
RUN npm set registry https://registry.npmjs.org/
RUN npm set progress=false

# Grunt, Bower, & Ember CLI
RUN npm install -g grunt-cli
RUN npm install -g bower
RUN npm install -g ember-cli
RUN npm install -g watchman

WORKDIR /var/www/html/ember-app

CMD ["ember","server"]

EXPOSE 4200 35729