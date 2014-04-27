#!/bin/sh
# @Author: evan
# @Date:   2014-04-26 17:03:55
# @Last Modified by:   evan
# @Last Modified time: 2014-04-27 00:42:00

BASE_FEED_URL="https://my.atlassian.com/download/feeds/"
PRODUCT="jira"

echo $SHELL

CURRENT_URL=$BASE_FEED_URL"current/"$PRODUCT".json"
echo $CURRENT_URL

CURRENT_LIST=$(wget -qO- $BASE_FEED_URL"current/"$PRODUCT".json")
#echo $CURRENT_LIST

CURRENT_LIST=`echo $CURRENT_LIST | sed "s/downloads(\[//" | sed "s/])//"`
#echo $CURRENT_LIST

#echo $CURRENT_LIST | awk -F "[{}]" '{ for (i=2; i<NF; i+=2) print "{",$i,"}" }'
#echo $CURRENT_LIST | awk '{n=split($0,a,","); for (i=1; i<=n; i++) print a[i]}'
echo $CURRENT_LIST | \
    # Extract the JSON descriptions of each download into multiple results
    awk -F "[{}]" '{ for (i=2; i<NF; i+=2) print "{",$i,"}" }' | \
    # Grab the downloads that are TAR.GZ files that aren't the WAR versions
    grep 'TAR.GZ' | grep -v 'WAR' | \
while read -r line; do
    echo "Processing $line"
done