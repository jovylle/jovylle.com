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

git clone https://github.com/again-faster/fitbox-web 













This command, `ALTER USER 'root'@'localhost' IDENTIFIED WITH auth_socket;`, is used to change the authentication method for the MySQL root user to use the `auth_socket` plugin. This plugin allows the operating system to authenticate the MySQL user, eliminating the need for a password.


Here are the steps to achieve this:

1. **Connect to MySQL:**
   Open a terminal and log in to MySQL as the root user or any user with sufficient privileges.

   ```bash
   mysql -u root -p
   ```
