#!/usr/bin/env python
# -*- coding: utf-8 -*-
# @Author: Evan Laske
# @Date:   2014-04-07 23:21:58
# @Last Modified by:   evan
# @Last Modified time: 2014-04-26 17:59:25

import urllib2
import json
import sys

def getURL(feed):
    # Base for previous versions
    # base_url = 'https://my.atlassian.com/download/feeds/%s/jira.json'
    # base_url = 'https://my.atlassian.com/download/feeds/%s/jira-core.json'
    base_url = 'https://my.atlassian.com/download/feeds/%s/jira-software.json'
    return base_url % feed

def getFeed(url):
    result = str(urllib2.urlopen(url).read())
    # Format the returned string to a real JSON format.
    json_result = '{{"json" : {0}}}'.format(result.strip('downloads()'))
    # Load the JSON string into a variable we'll use
    data = json.loads(json_result)['json']
    return data

def getDownloadData(download_data):
    # Get the regular tar.gz file and remove the WAR version
    return [e for e in download_data if 'TAR.GZ' in e['description'] and 'WAR' not in e['description']]

def getDownloadURL(download):
    return download['zipUrl']

def chunk_report(bytes_so_far, chunk_size, total_size):
    percent = float(bytes_so_far) / total_size
    percent = round(percent*100, 2)
    # Write the status of the download out - keep it on the same line
    # Note: This doesn't work in the Sublime built-in terminal
    sys.stdout.write("Downloaded %d of %d bytes (%0.2f%%)\r" % (bytes_so_far, total_size, percent))
    sys.stdout.flush()

    # If we reached the end of the download, finally move to the next line
    if bytes_so_far >= total_size:
        sys.stdout.write('\n')

def chunk_read(response, chunk_size=8192, report_hook=None):
    total_size = response.info().getheader('Content-Length').strip()
    total_size = int(total_size)
    bytes_so_far = 0

    data_string = str()

    while 1:
        chunk = response.read(chunk_size)
        data_string += chunk
        bytes_so_far += len(chunk)

        if not chunk:
            break

        if report_hook:
            report_hook(bytes_so_far, chunk_size, total_size)

    return data_string

def chunk_save(response, filename, chunk_size=8192, report_hook=None):
    total_size = response.info().getheader('Content-Length').strip()
    total_size = int(total_size)
    bytes_so_far = 0

    with open(filename, 'wb') as f:
        while 1:
            chunk = response.read(chunk_size)
            bytes_so_far += len(chunk)

            if not chunk:
                break

            if report_hook:
                report_hook(bytes_so_far, chunk_size, total_size)

            f.write(chunk)

    return bytes_so_far

def downloadFile(url):
    response = urllib2.urlopen(url)
    response_info = response.info()
    content_length = response.info().getheader('Content-Length')
    #file_data = chunk_read(response, report_hook=chunk_report)
    chunk_save(response, url.split('/')[-1], report_hook=chunk_report)

def allDownloads():
    eap = getDownloadData(getFeed(getURL('eap')))
    current = getDownloadData(getFeed(getURL('current')))
    archived = getDownloadData(getFeed(getURL('archived')))
    return list(eap + current + archived)

def defaultDownload():
    # The default download is the current version
    return getDownloadData(getFeed(getURL('current')))[0]


def main():
    for item in allDownloads():
        print item['version']

    print defaultDownload()['version']

    current = getDownloadData(getFeed(getURL('current')))
    for dl in current:
        downloadFile(getDownloadURL(dl))

# Standard main call
if __name__ == "__main__":
    main()
