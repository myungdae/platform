#!/bin/bash

set -e

cd /home/ubuntu/platformv2/frontend

npm install
npm run build

sudo mv /var/www/html/platform/.htaccess /tmp/.htaccess
sudo rm -rf /var/www/html/platform
sudo cp -rf /home/ubuntu/platformv2/frontend/build /var/www/html/platform
sudo mv /tmp/.htaccess /var/www/html/platform/.htaccess
sudo chown -R www-data.www-data /var/www/html
sudo systemctl restart apache2