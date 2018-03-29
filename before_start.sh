#!/bin/bash
echo pwd
sudo composer install
vendor/bin/phing www
