# Introduction

See the basic descriptions in the Synology PDF document under the 
WIZARD_UIFILES section. This talks about the basics.

# ExtJS

Synology uses Sencha ExtJS (http://www.sencha.com/products/extjs/) to make up
it's web UI. This means that anything they do to the UI files in a package
filters through this UI framework.

Looking through the examples, it looks to be that the reason these UI files 
are in the JSON format to begin with is because ExtJS uses this as an
initialized in it's UI constructors. See these examples:
http://docs.sencha.com/extjs/4.2.1/extjs-build/examples/form/field-types.html
This has the basic structure of Synology's, and some of the fields even match.
Unfortunately, not all of them do, meaning that it might not be possible to
get the entire functionality of the ExtJS framework...