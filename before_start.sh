#!/bin/bash
echo pwd
cd /opt/composer
composer install
vendor/bin/phing www
