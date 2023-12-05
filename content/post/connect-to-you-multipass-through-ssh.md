---
title: 'Connect to you Multipass through SSH'
description: 'Connect to you Multipass through SSH'
---

# Connect to you Multipass through SSH

Go to your multipass vm
`multipass shell foo`

Edit ssh config and allow PasswordAuthentication
`sudo nano /etc/ssh/sshd_config`
find "PasswordAuthentication no" and make it "yes" instead of "no"

restart ssh 
`sudo systemctl restart ssh`

go exit
`exit`

from your host do try ssh now.
`ssh ubuntu@multipassIp` (get ip from `multipass list` to show ip of your vm)

say `yes` if it asks for fingerprint, input your password.

And it shoud work by now.

if not try this
`multipass shell foo`
`sudo passwd ubuntu`
set your password again,
and `exit` try again to ssh.

And you could try this too.
inside multipass vm
`sudo usermod -aG sudo ubuntu` 
exit and try ssh again.






