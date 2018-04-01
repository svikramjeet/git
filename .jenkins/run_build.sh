#!/bin/bash
set -exo pipefail
cp .jenkins/.env.jenkins .env
php artisan migrate

./vendor/bin/security-checker security:check
./vendor/bin/parallel-lint --exclude vendor .
./vendor/bin/phpcs --colors -p --standard=PSR1 --ignore=vendor/*,database/*,_ide_helper* .
./vendor/bin/phpmd . text .circleci/phpmd_ruleset.xml --exclude vendor,_ide_helper.php,database,app/Console/Kernel.php,tests

./vendor/phpunit/phpunit/phpunit
