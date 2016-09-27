#!/usr/bin/env bash

if [ -z "$1" ]; then                                            # Check if there is an argument passed in
    echo usage: $0 directory
    exit
fi


WIFI="wpa-psk  $1"                                              # Change the wifi connection password
sed -r "s/wpa-psk.*/$WIFI/" /etc/network/interfaces


echo "Enter the current password for the root mysql account."   # Change the sql database password.
read oldrootpass
mysqladmin -u root -p"$oldrootpass" password "$1"


echo  $1|passwd root -stdin                                     # Change the ssh password (same as root password)