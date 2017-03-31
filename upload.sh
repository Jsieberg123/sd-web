#!/bin/bash

ssh root@aggautomation.com "stop sd-web"
ssh root@aggautomation.com "rm -rf /apps/sd-web && mkdir /apps/sd-web"
scp -r . root@aggautomation.com:/apps/sd-web
ssh root@aggautomation.com "cd /apps/sd-web && chmod +x start.sh"
ssh root@aggautomation.com "start sd-web"