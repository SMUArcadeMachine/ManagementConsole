FROM ubuntu:12.04

MAINTAINER Preston Tighe

## Install
RUN apt-get update

# Vim
RUN apt-get -y install vim wget git curl make bzip2 fontconfig autoconf automake clang g++ python-dev
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
RUN npm install -g phantomjs-prebuilt

# install watchman
# Note: See the README.md to find out how to increase the
# fs.inotify.max_user_watches value so that watchman will
# work better with ember projects.
#WORKDIR /tmp
#RUN git clone https://github.com/facebook/watchman.git
#WORKDIR watchman
#RUN git checkout v4.7.0
#RUN ./autogen.sh
#RUN ./configure
#RUN make
#RUN make install

WORKDIR /var/www/html/ember-app

CMD ["ember","server","--watcher","polling"]

EXPOSE 4200 35729