#!/bin/sh
echo 'backend starting'
nohup sh test.sh &
echo 'db started!'
nohup sh goServer.sh &
echo 'server started !'
