#!/bin/bash


content=$(wget http://production-review-tool.herokuapp.com/api/checkReadyToDeploy?app_name=clientshare-web -q -O -)
echo $content
if [ "${content:1:14}" == '"success":true' ]; then 
 exit 0
fi
exit 1
