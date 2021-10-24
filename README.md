# Special Date

Node-RED node that checks the current date against a list of dates, and returns the appropriate response string for matches.

# Installation
## Node-RED Palette Manager
Use the built-in Node-Red [Palette Manager](https://nodered.org/docs/user-guide/editor/palette/manager). Search for node-red-contrib-special-date to find and install.

## NPM CLI
In a terminal on your Node-RED server:
```sh
cd ~/.node-red
npm install node-red-contrib-special-date
```

# Change Log
v1.0.2
* Can define which property to put the result in on the message object so the payload can pass through untouched.

v1.0.1
* Added keywords

v1.0.0
* Initial release
