---
title: 'Sudo mysql without needing password'
description: 'Sudo mysql without needing password'
---

# Setup fitbox localdevelopment on Multipass VM


## install multipass
  Available on Mac or Windows

## create VM 
`multipass launch --name fit --cpus 1 --memory 2G --disk 8G`

## try to connect
`multipass list` to show vm list
`multipass shell fit` to got to fit vm shell

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
Install commonly used php extension
`sudo apt-get install php5.6-gd php5.6-mysql php5.6-imap php5.6-curl php5.6-intl php5.6-pspell php5.6-recode php5.6-sqlite3 php5.6-tidy php5.6-xmlrpc php5.6-xsl php5.6-zip php5.6-mbstring php5.6-soap php5.6-opcache libicu65 php5.6-common php5.6-json php5.6-readline php5.6-xml php5.6-bcmath`

## Install Composer verion 1


https://stackoverflow.com/questions/51324721/how-to-install-specified-version-of-composer

![image](https://github.com/jovyllebermudez/jovylle.com/assets/73716444/2333d230-e98d-4597-ade0-a50b75e2be71)
![image](https://github.com/jovyllebermudez/jovylle.com/assets/73716444/f890b9df-7f16-41de-a724-77484dbb610f)

git clone https://github.com/again-faster/fitbox-web 













This command, `ALTER USER 'root'@'localhost' IDENTIFIED WITH auth_socket;`, is used to change the authentication method for the MySQL root user to use the `auth_socket` plugin. This plugin allows the operating system to authenticate the MySQL user, eliminating the need for a password.


Here are the steps to achieve this:

1. **Connect to MySQL:**
   Open a terminal and log in to MySQL as the root user or any user with sufficient privileges.

   ```bash
   mysql -u root -p
   ```
