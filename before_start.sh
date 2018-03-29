#!/bin/sh
sudo apt-get -y install yum
sudo yum install -y httpd
yum update
yum install -y httpd
sudo service httpd start
