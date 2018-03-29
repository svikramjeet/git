#!/bin/bash
cd /var/www/html/
sudo composer install
vendor/bin/phing www
