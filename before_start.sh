#!/bin/sh
sudo apt-get install yum
yum update
yum install -y httpd
service httpd start
