#!/bin/sh
# @Author: evan
# @Date:   2014-04-26 17:03:55
# @Last Modified by:   evan
# @Last Modified time: 2014-04-27 00:58:37

BASE_FEED_URL="https://my.atlassian.com/download/feeds/"
PRODUCT="jira"

echo $SHELL

CURRENT_URL=$BASE_FEED_URL"current/"$PRODUCT".json"
echo $CURRENT_URL

# Gather the list of downloads from the server
CURRENT_LIST=$(wget -qO- $BASE_FEED_URL"current/"$PRODUCT".json")
#echo $CURRENT_LIST

# Remove the jquery bits from the string
CURRENT_LIST=`echo $CURRENT_LIST | sed "s/downloads(\[//" | sed "s/])//"`
#echo $CURRENT_LIST

echo $CURRENT_LIST | \
    # Extract the JSON descriptions of each download into multiple results
    awk -F "[{}]" '{ for (i=2; i<NF; i+=2) print "{",$i,"}" }' | \
    # Grab the downloads that are TAR.GZ files that aren't the WAR versions
    grep 'TAR.GZ' | grep -v 'WAR' | \
while read -r line; do
    echo "Processing $line"
done

# Test the filter with the archived list
echo "Archived:\n"

# Gather the list of downloads from the server
wget -qO- $BASE_FEED_URL"archived/"$PRODUCT".json" | \
    # Remove the jquery bits from the string
    sed "s/downloads(\[//" | sed "s/])//" | \
    # Extract the JSON descriptions of each download into multiple results
    awk -F "[{}]" '{ for (i=2; i<NF; i+=2) print "{",$i,"}" }' | \
    # Grab the downloads that are TAR.GZ files that aren't the WAR versions
    grep 'TAR.GZ' | grep -v 'WAR' | \
while read -r line; do
    echo "Processing $line"
done