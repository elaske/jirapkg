#!/usr/bin/env python
# -*- coding: utf-8 -*-
# @Author: Evan Laske
# @Date:   2014-04-07 23:21:58
# @Last Modified by:   Evan Laske
# @Last Modified time: 2014-04-25 23:46:00

import urllib2
import json

def getURL(feed):
    base_url = 'https://my.atlassian.com/download/feeds/%s/jira.json'
    return base_url % feed

def getFeed(url):
    result = str(urllib2.urlopen(url).read())
    # Format the returned string to a real JSON format.
    json_result = '{{"json" : {0}}}'.format(result.strip('downloads()'))
    # Load the JSON string into a variable we'll use
    data = json.loads(json_result)['json']
    return data

def getDownload(download_data):
    # Get the normal tar.gz download file - single it out and remove the WAR one.
    return [e for e in download_data if 'TAR.GZ' in e['description'] and 'WAR' not in e['description']][0]

def getDownloadURL(download):
    return download['zipUrl']

def main():
    print getURL('current')
    print getDownload(getFeed(getURL('current')))
    print getDownloadURL(getDownload(getFeed(getURL('current'))))

# Standard main call
if __name__ == "__main__":
    main()
