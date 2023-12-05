---
title: 'Sudo mysql without needing password'
description: 'Sudo mysql without needing password'
---

# Setup fitbox localdevelopment on Multipass VM

## Some notes (inside the VM not the host machine)
- needed mysql 6.7
- needed php 5.6
- needed composer 1.x and not 2.x
- worked on Ubuntu 22 and I tried on Ubuntu 18 it didn't not sure yet why.

## Optional,
- phpmyadmin 4.9.9 (not 5.0 or up due to its requirement of php 7)


## install multipass
  Available on Mac or Windows

## create VM 
`multipass launch --name fit --cpus 1 --memory 2G --disk 8G`

## try to connect
`multipass list` to show vm list
`multipass shell fit` to got to fit vm shell (almost all of commands will be run inside the multipass shell)

# Install needed

## install mysql 5.7

reference: https://stackoverflow.com/questions/73250312/how-can-i-install-mysql-5-7-on-ubuntu-22-04-lts 

go to home `cd ~` then
`wget https://dev.mysql.com/get/mysql-apt-config_0.8.12-1_all.deb`
`sudo dpkg -i mysql-apt-config_0.8.12-1_all.deb`

choose "Ubuntu Bionic"
and choose this.
![image](https://github.com/jovyllebermudez/jovylle.com/assets/73716444/e921c1b3-19a8-466b-b1ff-ad6e14c4e5cc)

do `sudo apt-get update`  and you will have error "E: The repository 'http://repo.mysql.com/apt/ubuntu bionic InRelease' is not signed."
do `sudo apt-key adv --keyserver keyserver.ubuntu.com --recv-keys 467B942D3A79BD29`
do `sudo apt-get update` again, error should gone

check if its ready `apt-cache policy mysql-server` 
you should see the 5.7
![image](https://github.com/jovyllebermudez/jovylle.com/assets/73716444/01795839-6a78-47e7-aa4d-1a36b64fd529)

You can now install whats needed `sudo apt install -f mysql-client=5.7* mysql-community-server=5.7* mysql-server=5.7*`

It will then ask for the mysql's root password to be set.

try connecting now to mysql

`sudo mysql -p` then input the password
mysql>`create database local_fitbox` to create the database ready.
then
mysql>`exit`
![image](https://github.com/jovyllebermudez/jovylle.com/assets/73716444/cf6e670e-1ff6-4e0a-9db6-e32c59d9a426)



## Install NVM for node 10

reference: https://github.com/nvm-sh/nvm

`curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.6/install.sh | bash`
exit terminal and connect again to refresh
do `nvm -v` and there its installed.
do `nvm install 10` to install node 10
test `node -v` to see its v10.24.1 and its read

## Install Php 5.6
reference: https://vitux.com/how-to-install-php5-php8-on-ubuntu/

`sudo add-apt-repository ppa:ondrej/php`
`sudo apt update`
`sudo apt install -y php5.6`
test if php ready `php -v` should show PHPH 5.6....
Install commonly used php extension, which is needed for this project too.
`sudo apt-get install php5.6-gd php5.6-mysql php5.6-imap php5.6-curl php5.6-intl php5.6-pspell php5.6-recode php5.6-sqlite3 php5.6-tidy php5.6-xmlrpc php5.6-xsl php5.6-zip php5.6-mbstring php5.6-soap php5.6-opcache libicu65 php5.6-common php5.6-json php5.6-readline php5.6-xml php5.6-bcmath`

## Install Composer verion 1

`curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer --version=1.10.27`

reference: 
https://stackoverflow.com/questions/51324721/how-to-install-specified-version-of-composer
https://phoenixnap.com/kb/how-to-install-composer-ubuntu#:~:text=Steps%20For%20Installing%20PHP%20Composer%20on%20Ubuntu%201,4%20Step%204%3A%20Install%20PHP%20Composer%201.%20


## Install Bower and Yarn
`npm install -g yarn`
`npm install -g bower`

## Install Redis I forgot.
`sudo apt install redis-server`

## Download the project
`git clone https://github.com/again-faster/fitbox-web`
`cd fitbox-web`

## Project install packages/dependencies
'yarn install` or `yarn`
`bower install`
`composer install` This part will need the php extensions.
`yarn run build`

## Get your .env somewhere, ask
put it on .env in project

## Test Run Project
`php artisan serve --host 0.0.0.0` remember we are still inside multipass
if it says "Mcrypt PHP extension required."
do `sudo apt install php5.6-mcrypt`
ref: https://linux-packages.com/ubuntu-focal-fossa/package/php56-mcrypt
do `php artisan serve --host 0.0.0.0` --host 0.0.0.0 is needed here, I don't know whey 0.0.0.0 is not equal to localhost, you can Port Forward it if you want.
open new terminal of the host computer not inside multipass shell,
`multipass list`
and it will show like below. you can see the Ipv4

$ multipass list
Name                    State             IPv4             Image
fit                     Running           172.22.47.59     Ubuntu 22.04 LTS    

access 172.22.47.59:8000 on your browser. tada.


## Ask for the database import to your local
mysql -u root -p local_fitbox < pathtosql/fitbox.sql


## Do this to do migrations, but if you already have the database imported maybe not.
`php artisan migrate`


## If you want it in nginx
`sudo apt install nginx`

