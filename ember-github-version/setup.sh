#!/bin/bash

# set directory name as supplied or default to current directory name

old='__blueprint__'
new=${1-${PWD##*/}}

# replace occurences with 

for i in bower.json package.json app/index.html config/environment.js tests/index.html
  do sed -i '' "s/$old/$new/g" $i
done

# add to gitignore

printf "\n# dependencies\n/node_modules\n/bower_components" >> .gitignore

# commit changes

git commit -am 'blueprint setup'

# remove git origin repo

git remote remove origin
