#!/bin/bash
sudo chown -R ubuntu:www-data /var/www/html
sudo find /var/www/html -type d -exec chmod 755 {} +
sudo find /var/www/html -type f -exec chmod 644 {} +
sudo chmod -R 777 /var/www/html/storage

composer update -d /var/www/html
