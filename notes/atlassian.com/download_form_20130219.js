/*

search for #no-tab to find where designs fork

*/
String.prototype.capitalize = function() {
    return this.charAt(0).toUpperCase() + this.slice(1);
}

$(function() {
    $('.or-divide').hide();
});

WAC = [];
WAC.Download = function() {

    $('#tabsNav li.tab a').click( function(e) { filterbyOS(e) } );
	$('.filename, #allDownloads a').click(function(){
    
	});
  // removed by suggestion via: WTF-2584
    // $('#tabsFilter a').click( function(e) { filterbyType(e) } );

    $('#tabsFilter').show();
    filterbyOS();
    var t = document.location.search;
    var i = t.indexOf('type=');
    if (t && i != -1) {
        var j = t.indexOf('&',i);
        j = (j > i) ? j : t.length;
        t = t.substring(i + 5, j)
    } else {
        t = null;
    }
    t = t ? t : 'rec';                    

  // removed by suggestion via: WTF-2584
    // filterbyType(null,t);

    function filterbyOS(event) {
        var os;
        if (event) {
            $(event.target).closest('a').blur();
            var element = $(event.target).closest('li');
            os = element.attr('id').substring(4,element.attr('id').length);
            event.preventDefault();
            event.stopPropagation();
        }                                                                   

        if ($('#tabsNav')) {

            os = os || getOS();

            $('#tabsNav li.tab').removeClass('selected');

            $('#downloads .version,#downloads .warning').hide();
            $('#downloads .version.' + os ).show();
            if (os == "mac"){
                $('#downloads .warning').show();
            }
            $('#tab_' + os).addClass('selected');
        }
    };

    function filterbyType(event,type) {
        type = type ? type : 'rec';
        var element;
        if (event) {
            element = $(event.target).closest('a');
            element.blur();
            type = element.attr('id') || 'rec';
            event.preventDefault();
            event.stopPropagation();
        }

        if (type == 'rec') {
            $('div.download').hide();
            $('div.download.rec').show();
      $('#tabsFilter a').removeClass('selected')
      $('#showall').addClass('selected');
        } else {
            $('div.download').show();               
      $('#tabsFilter a').removeClass('selected')
      $('#rec').addClass('selected');
        }
        if (element) {
            $('#tabsFilter a').attr('href','#');
            element.removeAttr('href');
        } else {
            $('#tabsFilter a').attr('href','#');
            $('#' + type).removeAttr('href');
        }
    };

    function getOS() {
        if (navigator.appVersion.indexOf("Mac")!=-1)
            return "mac";
        if (navigator.appVersion.indexOf("X11")!=-1 || navigator.appVersion.indexOf("Linux")!=-1)
            return "linux";
        return "win";
    };

};

// #no-tab variables
var macPreferred = [];
var unixPreferred = [];
var winPreferred = [];
WAC.contextPath = ''

WAC.currentDownloads = function(product, showAllPlatforms, productDisplayName, contextPath) {
    WAC.contextPath = contextPath;

  if (product == "sharepoint-connector") {
    product = "sharepointconnector";
  }
    var url = "https://my.atlassian.com/download/feeds/current/" + product + ".json";
    //var url = "https://localhost:8888/jira.json";
    
    
  $.jsonp({
        url: url,
        callback: "downloads",
		timeout: 5000,
        cache: true,
        success: function(data) {

            $('div.spinner').hide();
            $('.or-divide').show();

            if (showAllPlatforms) {   // dont separate downloads by platform
                $.each(data, function(i, item) {
                    WAC.displayDownloads(i, item, "win", product, productDisplayName);
                });

                $('<div class="clearer"/>').appendTo('.win');
            } else {

                var windowsDownloads = []
                var macDownloads = []
                var unixDownloads = []

                // Sort downloads by platform
                $.each(data, function(i, item) {
                    if (item.platform.indexOf("Windows") != -1) {
                        windowsDownloads.push(item);
                    }
                    if (item.platform.indexOf("Mac OS X") != -1) {
                        macDownloads.push(item);
                    }
                    if (item.platform.indexOf("Unix") != -1) {
                        unixDownloads.push(item);
                    }
                });

                

                if (product != 'jira') { // JIRA gets the no tab version shoing only the preferred downloads #no-tab

                    $.each(windowsDownloads, function(i, item) {
                        WAC.displayDownloads(i, item, "win", product, productDisplayName);

                    });
                    $.each(macDownloads, function(i, item) {
                        WAC.displayDownloads(i, item, "mac", product, productDisplayName);

                    });
                    $.each(unixDownloads, function(i, item) {
                        WAC.displayDownloads(i, item, "linux", product, productDisplayName);
                    });

                } else {

                   
                    $.each(windowsDownloads, function(i, item) {
                        var splitDescription = ['', ''];
                        splitDescription = item.description.split('(');
                        var version = splitDescription[0];
                        
                        try {
                            var title = splitDescription[1].replace(')', '');
                        } catch(err) {
                            // There was an error with JSON format
                        }
                        item.version = version;
                        item.title = title;
                        item.os = 'win';
                        if (product == 'jira') {
                            item.product = product.toUpperCase();
                        } else {
                            item.product = product.capitalize();
                        }

                        $('.winCol').find('ul').append('<li><a href="' + item.zipUrl + '">' + item.product + ' ' + item.version + '</a> (' + title + ')</li>');

                        var exe = item.zipUrl.substr(item.zipUrl.length - 3);
                        if(exe == 'exe') {
                            winPreferred.push(item);
                            WAC.displayDownloads(i, item, "win", product, productDisplayName);
                        }
                    });

                    $.each(unixDownloads, function(i, item) {
                        var splitDescription = ['', ''];
                        splitDescription = item.description.split('(');
                        var version = splitDescription[0];

                        try {
                        var title = splitDescription[1].replace(')', '');
                        } catch(err) {
                            // There was an error with JSON format
                        }
                        item.version = version;
                        item.title = title;
                        item.os = 'linux';
                        if (product == 'jira') {
                            item.product = product.toUpperCase();
                        } else {
                            item.product = product.capitalize();
                        }

                        $('.linuxCol').find('ul').append('<li><a href="' + item.zipUrl + '">' + item.product + ' ' + item.version + '</a> (' + title + ')</li>');

                        var bin = item.zipUrl.substr(item.zipUrl.length - 3);
                        if(bin == 'bin') {
                            unixPreferred.push(item);
                            WAC.displayDownloads(i, item, "linux", product, productDisplayName);
                        }
                    });

                    $.each(macDownloads, function(i, item) {
                        var splitDescription = ['', ''];
                        splitDescription = item.description.split('(');
                        var version = splitDescription[0];
                        try {
                        var title = splitDescription[1].replace(')', '');
                        } catch(err) {
                            // There was an error with JSON format
                        }
                        item.version = version;
                        item.title = 'OS X Installer (' + title + ')';
                        item.os = 'mac';
                        if (product == 'jira') {
                            item.product = product.toUpperCase();
                        } else {
                            item.product = product.capitalize();
                        }

                        $('.macCol').find('ul').append('<li><a href="' + item.zipUrl + '">' + item.product + ' ' + item.version + '</a> (' + title + ')</li>');

                        var warTarGz = item.zipUrl.substr(item.zipUrl.length - 10);
                        if(warTarGz != 'war.tar.gz') {
                            macPreferred.push(item);
                            WAC.displayDownloads(i, item, "mac", product, productDisplayName);
                        }
                    });

                }

                if (product == 'jira') {
                    //$('<span class="warning"><strong>Note:</strong> ' + jQuery.trim($("#osxErrorText").text()) + '</span>').appendTo('#downloads');
                }
                if (product == 'confluence') {
                    $('<span class="warning"><strong>Note:</strong> ' + jQuery.trim($("#osxErrorConfluenceText").text()) + '</span>').appendTo('#downloads');
                }
                $('<div class="clearer"/>').appendTo('.version');

                WAC.Download();
				// window.optimizely.push(["activate", 91098038]);
            }

            // build preferred download list
            
            
            
            

        },

        error: function(x, t, m) {

				$('div.spinner').hide();
	            $('<div class="download alt rec"><p>' + jQuery.trim($("#feedErrorText").text()) + '</p></div>').appendTo('.version').eq(0);
				console.log();
	            $('<div class="clearer"/>').appendTo('.version').eq(0);

        }
		
    });
}

WAC.displayDownloads = function(i, item, platform, product, prependProductName) {

    var contextPath = WAC.contextPath;

    

  if (product == "sharepoint-connector") {
    product = "sharepointconnector";
  }
    
    // Create the download link
    var entry;
    if (0 == i%2) {
        entry = $('<div class="download alt"/>').appendTo('.' + platform);
    } else {
        entry = $('<div class="download"/>').appendTo('.' + platform);
    }

    var recommended = false;

    if (product == 'clover' || product == 'sharepointconnector') {   // All downloads should be classed as recommended for clover
        recommended = true;
    } else {
        if (product == 'confluence') {
            // For Confluence, the first two Windows/Mac OS X downloads are recommended
            if (i == 0 || i == 1 && platform == 'linux') {
                recommended = true;
            } else if (i < 2 && (platform == 'mac' || platform == 'win')) {
                recommended = true;
            }
        } else {
            // For Windows/Mac OS X, the first 2 download items are recommended, for Unix, only the first is
            if (i == 0) {
                recommended = true;
            }
        }
    }

    if (recommended) {
        entry.addClass("rec");
    }

    var info = $('<div class="info"/>').appendTo(entry);


    // var onclick = "window.location='" + contextPath + "/software/Download.jspa?file=" + item.zipUrl + "'; return false;";
  if (product == "sharepointconnector") {
    product = "sharepoint-connector";
  }
  
  
  
    var onclick = "window.location='" + contextPath + "/software/"+ product + "/post-download?file=" + item.zipUrl + "&version=" + item.version;
    

  if (product == "sharepoint-connector") {
    product = "sharepointconnector";
  }

    if (product != 'jira') { // Give a different header for #no-tab design
        var linkText = ((prependProductName != null) ? prependProductName + ' ' : '') + item.description;
    } else {
        var linkText = '<div class="productTitle"><h1>' + item.title + '</h1></div>';
    }
    
    if (product == 'jira' || product == 'confluence') {
            var link = $('<span class="downloadTitle">' + linkText +'</span>').appendTo(info);
    } else {
            var link = $('<a href="'+item.zipUrl+'" class="filename" onclick="'+ onclick + '\';return false;">' + linkText +'</a>').appendTo(info);
    }



    // Add the release info

    var releaseInfoDiv = $('<div class="releaseInfo">');
    var releaseInfo = '';
    var releaseLinks = '';

    
    if (product != 'jira') { // If not the no tab design #no-tab

        if (item.size != null && item.size != '') {
            releaseInfo += item.size + ' &#8226; ';
        }
        if (item.released != null && item.released != '') {
            releaseInfo += jQuery.trim($("#releasedText").text()) + ' ' + item.released;
        }

        if (item.releaseNotes != '' && item.upgradeNotes == '') {
            releaseLinks += '<a href="' + item.releaseNotes + '">' + jQuery.trim($("#releaseNotesText").text()) + '</a>';
        }
        if (item.releaseNotes != '' && item.upgradeNotes != '') {
            var relLink = '<a href="' + item.releaseNotes + '">' + jQuery.trim($("#releaseNotesText").text()) + '</a>';
            var upgradeLink = '<a href="' + item.upgradeNotes + '">' + jQuery.trim($("#upgradeNotesText").text()) + '</a>';
            releaseLinks += relLink + ' | ' + upgradeLink;
        }
        if (item.releaseNotes == '' && item.upgradeNotes != '') {
            var upgradeLink = '<a href="' + item.upgradeNotes + '">' + jQuery.trim($("#upgradeNotesText").text()) + '</a>';
            releaseLinks += upgradeLink;
        }

        if (item.md5 != null && item.md5 != '') {
            releaseLinks += ' | ' + '<a href="' + item.zipUrl + '.md5">MD5</a>';
        }

        if (releaseLinks != '') {
            releaseInfo += ' (' + releaseLinks + ')';
        }
    } else {
        //console.log(item);
        if (item.os == 'mac') {
            $('#releaseNotesMac').html(item.product + ' ' + item.version + ' ' + '<a href="' + item.releaseNotes + '">Release Notes</a> | <a href="' + item.upgradeNotes + '">Upgrade Notes</a>');
        }
        if (item.os == 'win') {
            $('#releaseNotesWin').html(item.product + ' ' + item.version + ' ' + '<a href="' + item.releaseNotes + '">Release Notes</a> | <a href="' + item.upgradeNotes + '">Upgrade Notes</a>');
        }
        if (item.os == 'linux') {
            $('#releaseNotesLinux').html(item.product + ' ' + item.version + ' ' + '<a href="' + item.releaseNotes + '">Release Notes</a> | <a href="' + item.upgradeNotes + '">Upgrade Notes</a>');
        }


    }

    if (product == 'clover') {
        if (item.description.indexOf("Eclipse") != -1) {
            releaseInfo += ' ' + jQuery.trim($("#eclipseWarningText").text()) ;
        }
    }

    releaseInfoDiv.html(releaseInfo);
    releaseInfoDiv.appendTo(info);

    if (product == 'clover') {                               
        
        $('<div class="clearer"/>').appendTo('.win');
    }
        var button = $('<div class="button ctaDownload"/>').appendTo(entry);


        if (product == 'jira' || product == 'confluence') {                                                                                                                         
            var link = $('<a href="'+item.zipUrl+'" class="filename buttonTxt" onclick="'+ onclick + '&usertype=trial\'; return false;"/>').appendTo(button);            
            var linkExisting = $('<a href="'+item.zipUrl+'" class="linkExisting" onclick="'+ onclick + '&usertype=existing\'; return false;"/>').insertAfter(button);
        } else {
            var link = $('<a href="'+item.zipUrl+'" class="filename buttonTxt" onclick="'+ onclick + '\'; return false;"/>').appendTo(button);            
        }    

        var img;

        if (product == 'perforceplugin' || product == 'vssplugin') {
            // img = $('<img src="'+contextPath + '/images/button_download.png" alt="Download"/>');
        } else if (product == 'sharepointconnector') {
             // img = $('<img src="'+contextPath + '/software/confluence/images/button_download.png" alt="Download"/>');
        } else {
            if (recommended) {
                // img = $('<img src="'+contextPath + '/software/'+product+'/images/button_download.png" alt="Download"/>');
            } else {
                // img = $('<img src="'+contextPath + '/software/'+product+'/images/button_download_small.png" alt="Download"/>');
            }
        }

        // img.appendTo(link);

    link.append(jQuery.trim($("#downloadText").text()));
    if (product == 'jira' || product == 'confluence') {
        linkExisting.append(jQuery.trim($("#linkExistingText").text()));        
    }

    //info.append("<div style='position:absolute; right:22px; top:56px;'><a href='" +item.zipUrl+ "' onclick='"+ onclick + "'>" + jQuery.trim($("#customerText").text()) + " " + jQuery.trim($("#customerLinkText").text()) + "</a></div>");
}

WAC.archivedDownloads = function(product, productDisplayName, sortByVersion, contextPath) {
  WAC.contextPath = contextPath;
  if (product == "sharepoint-connector") {
    product = "sharepointconnector";
  }
  
    var url = "https://my.atlassian.com/download/feeds/archived/" + product + ".json";
    var contextPath = WAC.contextPath;
    // var contextPath = $('#contextpath').text();

    $.jsonp({
        url: url,
        callback: "downloads",
        cache: true,
        success: function(data){
            $('div.spinner').hide();

            if (sortByVersion) {
                // Sort JIRA archived downloads by version

                // TODO!!

            } else {
                var table = $('.archived');

                if (data.length > 0) {

                    $.each(data, function(i, item) {

                        var versionTH = item.description;

                        var releaseInfo = '';
                        var releaseLinks = '';

                        if (item.releaseNotes != '' && item.upgradeNotes == '') {
                            releaseLinks += '<a href="' + item.releaseNotes + '">' + jQuery.trim($("#releaseNotesText").text()) + '</a>';
                        }
                        if (item.releaseNotes != '' && item.upgradeNotes != '') {
                            var relLink = '<a href="' + item.releaseNotes + '">' + jQuery.trim($("#releaseNotesText").text()) + '</a>';
                            var upgradeLink = '<a href="' + item.upgradeNotes + '">' + jQuery.trim($("#upgradeNotesText").text()) + '</a>';
                            releaseLinks += relLink + ' | ' + upgradeLink;
                        }
                        if (item.releaseNotes == '' && item.upgradeNotes != '') {
                            var upgradeLink = '<a href="' + item.upgradeNotes + '">' + jQuery.trim($("#upgradeNotesText").text()) + '</a>';
                            releaseLinks += upgradeLink;
                        }

                        if (item.md5 != null && item.md5 != '') {
                            releaseLinks += ' | ' + '<a href="' + item.zipUrl + '.md5">MD5</a>';
                        }

                        if (releaseLinks != '') {
                            releaseInfo += '<span class="smallish">(' + releaseLinks + ')</span>';
                        }

                        if (releaseInfo != '') {
                             versionTH += releaseInfo;
                        }


                        var version = $('<th class="c1">' + versionTH + '</th>');
                        var size = $('<td class="smallish">'+ item.size + '</td>');
                        var added = $('<td class="smallish">'+ item.released + '</td>');

                        var link = '';

                        if (item.zipUrl != null) {
                            // var onclick = "window.location='" + contextPath + "/software/Download.jspa?file=" + item.zipUrl + "'; return false;";
              if (product == "sharepointconnector") {
                product = "sharepoint-connector";
              }

              if (product !== "greenhopper") {
                var onclick = "window.location='" + contextPath + "/software/"+ product + "/post-download?file=" + item.zipUrl + "'; return false;";
				} else {
					var onclick = "";
				}

              if (product == "sharepoint-connector") {
                product = "sharepointconnector";
              }
                            var linkText = WAC.filenameExtension(item.zipUrl);
                            link += '<a href="'+item.zipUrl+'" onclick="'+ onclick + '">' + linkText +'</a>';

                            if (item.tarUrl) {
                                link += " | ";
                            }
                        }

                        if (item.tarUrl != null) {
                            // var onclick = "window.location='" + contextPath + "/software/Download.jspa?file=" + item.tarUrl + "'; return false;";
              if (product == "sharepointconnector") {
                product = "sharepoint-connector";
              }
              if (product !== "greenhopper") {
                var onclick = "window.location='" + contextPath + "/software/"+ product + "/post-download?file=" + item.zipUrl + "'; return false;";
				} else {
					var onclick = "";
				}              
				
				if (product == "sharepoint-connector") {
                product = "sharepointconnector";
              }
                            var linkText = WAC.filenameExtension(item.tarUrl);
                            link += '<a href="'+item.tarUrl+'" onclick="'+ onclick + '">' + linkText +'</a>';
                        }

                        var format = $('<td class="smallish">'+ link + '</td>');

                        table.find('tbody')
                            .append($('<tr>')
                                .append(version)
                                .append(size)
                                .append(added)
                                .append(format));

                    });
                }
                else {
                    table.find('tbody')
                            .append($('<tr>')
                                .append($('<td colspan="5">')
                                    .text(jQuery.trim($("#noText").text()) + ' ' + productDisplayName + ' ' + jQuery.trim($("#archiveErrorText").text()))));
                }

                table.fadeIn();

            }
        },
        error: function() {
            $('div.spinner').hide();
            $('.archived').find('tbody').append($('<tr><td colspan="4"><span class="fontRed">' + jQuery.trim($("#feedErrorText").text()) + '</span></td></tr>'));
            $('.archived').fadeIn();
        }
    });
}

WAC.checkEAPDownloads = function(product, contextPath) {
    WAC.contextPath = contextPath;
  if (product == "sharepoint-connector") {
    product = "sharepointconnector";
  }
    var url = "https://my.atlassian.com/download/feeds/eap/" + product + ".json";

    $.ajax({
        url: url,
        callback: "downloads",
    dataType: 'jsonp',
        cache: true,
        success: function(data) {

            if (data.length > 0) {
                $('#eapdownloads').show();
            }
        }
    });
}

WAC.eapDownloads = function(product, productDisplayName, contextPath) {
    WAC.contextPath = contextPath;
  if (product == "sharepoint-connector") {
    product = "sharepointconnector";
  }
    var url = "https://my.atlassian.com/download/feeds/eap/" + product + ".json";

    // var contextPath = $('#contextpath').text(); 
    var contextPath = WAC.contextPath;

    $.jsonp({
        url: url,
        callback: "downloads",
        cache: true,
        success: function(data) {
			var results = data;
            $('div.spinner').hide();

            var table = $('.eapdownloads');

            if (data.length > 0) {

                $.each(data, function(i, item) {

					
					// if (item.version) {}
					
					
					
                    var versionTH = item.description;

                    var releaseInfo = '';
                    var releaseLinks = '';

                    if (item.releaseNotes != '' && item.upgradeNotes == '') {
                        releaseLinks += '<a href="' + item.releaseNotes + '">' + jQuery.trim($("#releaseNotesText").text()) + '</a>';
                    }
                    if (item.releaseNotes != '' && item.upgradeNotes != '') {
                        var relLink = '<a href="' + item.releaseNotes + '">' + jQuery.trim($("#releaseNotesText").text()) + '</a>';
                        var upgradeLink = '<a href="' + item.upgradeNotes + '">' + jQuery.trim($("#upgradeNotesText").text()) + '</a>';
                        releaseLinks += relLink + ' | ' + upgradeLink;
                    }
                    if (item.releaseNotes == '' && item.upgradeNotes != '') {
                        var upgradeLink = '<a href="' + item.upgradeNotes + '">' + jQuery.trim($("#upgradeNotesText").text()) + '</a>';
                        releaseLinks += upgradeLink;
                    }

                    if (releaseLinks != '') {
                        releaseInfo += '<span class="smallish">(' + releaseLinks + ')</span>';
                    }

                    if (releaseInfo != '') {
                         versionTH += releaseInfo;
                    }
					
					
					if (item.version.indexOf('OD') !== -1) {
						var version = $('<th class="c1 od-eap">' + versionTH + '</th>');
					} else {
						var version = $('<th class="c1 not-od-eap">' + versionTH + '</th>');
					}
                    
                    var size = $('<td class="smallish">'+ item.size + '</td>');
                    var added = $('<td class="smallish">'+ item.released + '</td>');
					

					
                    var link = '';

                    if (item.zipUrl != null) {
                        // var onclick = "window.location='" + contextPath + "/software/Download.jspa?file=" + item.zipUrl + "'; return false;";
            if (product == "sharepointconnector") {
              product = "sharepoint-connector";
            }
                var onclick = "window.location='" + contextPath + "/software/"+ product + "/post-download?file=" + item.zipUrl + "'; return false;";
              if (product == "sharepoint-connector") {
                product = "sharepointconnector";
              }
                        var linkText = WAC.filenameExtension(item.zipUrl);
                        link += '<a href="'+item.zipUrl+'" onclick="'+ onclick + '">' + linkText +'</a>';
                    }

                    var format = $('<td class="smallish">'+ link + '</td>');

                    table.find('tbody')
                        .append($('<tr>')
                            .append(version)
                            .append(size)
                            .append(added)
                            .append(format));

                });

				$('.od-eap').parent('tr').addClass('odVersion');
				$('.not-od-eap').parent('tr').addClass('notOdVersion');				
				if ($('.not-od-eap').length == 0 && $('.odVersion:visible').length == 0) {
					$('.downloadTable').append('<tr><td colspan="4">There are currently no EAP releases available for download.</td></tr>');
				}
		
            } else {
                $('.note').show();
                table.find('tbody')
                            .append($('<tr>')
                                .append($('<td colspan="4">')
                                    .text(jQuery.trim($("#noText").text()) + ' ' + productDisplayName + ' ' + jQuery.trim($("#eapText").text()))));
            }

            table.fadeIn();
        },
        error: function() {
            $('div.spinner').hide();
            $('.eapdownloads').find('tbody').append($('<tr><td colspan="4"><span class="fontRed">' + jQuery.trim($("#feedErrorText").text()) + '</span></td></tr>'));
            $('.eapdownloads').fadeIn();
        }




    });

}

WAC.filenameExtension = function(filename) {


    if (filename == null || filename == '') {
        return "";
    }

    if (WAC.endsWith(filename, ".tar.gz")) {
        return "TAR.GZ";
    }

    if ((filename.indexOf(".") != -1) && !(WAC.endsWith(filename, "."))) {
        return filename.substring(filename.lastIndexOf(".")+1).toUpperCase();
    }

    return "";
}

WAC.endsWith = function(s, extension) {
    return s.length >= extension.length && s.substr(s.length - extension.length) == extension;
}
