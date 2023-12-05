---
title: 'Sudo mysql without needing password'
description: 'Sudo mysql without needing password'
---


This command, `ALTER USER 'root'@'localhost' IDENTIFIED WITH auth_socket;`, is used to change the authentication method for the MySQL root user to use the `auth_socket` plugin. This plugin allows the operating system to authenticate the MySQL user, eliminating the need for a password.

Here are the steps to achieve this:

1. **Connect to MySQL:**
   Open a terminal and log in to MySQL as the root user or any user with sufficient privileges.

   ```bash
   mysql -u root -p
   ```
