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

2. **Run the ALTER USER Command:**
   Once you are in the MySQL shell, run the following command to change the authentication method for the root user:

   ```sql
   ALTER USER 'root'@'localhost' IDENTIFIED WITH auth_socket;
   ```

3. **Flush Privileges:**
   After altering the user, you need to flush the privileges so that the changes take effect:

   ```sql
   FLUSH PRIVILEGES;
   ```

4. **Exit MySQL:**
   You can then exit the MySQL shell:

   ```sql
   EXIT;
   ``` 

Then try accessing mysql again without -p but with sudo.

 ```bash
 sudo mysql -u root
 ```

After completing these steps, the root user should be able to log in without a password, but only from the local machine (localhost). The `auth_socket` plugin authenticates based on the operating system user credentials. If you connect from a different host, you might need to create a user for that host with a password or use a different authentication method.

Please note that using `auth_socket` can be more secure if properly configured and limited to trusted users and hosts. Ensure that your MySQL server is properly secured to prevent unauthorized access.
