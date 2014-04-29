/**
    Loads extensions and connects.
    Exposes xmpp client for extensions to use.
    Exposes data {} for extensions to use.
*/

var EventEmitter = require('events').EventEmitter;

export class xmpp {
    constructor() {
        var SimpleXMPP = require('simple-xmpp').SimpleXMPP;

        var events = this.events = new EventEmitter();
        this.on = function() {
            events.on.apply(events, Array.prototype.slice.call(arguments));
        };
        this.removeListener = function() {
            events.removeListener.apply(events, Array.prototype.slice.call(arguments));
        };
        this.emit = function () {
            events.emit.apply(events, Array.prototype.slice.call(arguments));  
        }

        this.client = new SimpleXMPP();
        this.data = {};
        this.loadExtensions();    
    }

    connect(options) {
        this.client.connect(options);
    }

    loadExtensions() {
        var fs = require('fs');
        var corePaths = fs.readdirSync('./lib/core/');
        var extPaths = fs.readdirSync('./lib/extensions/');
        corePaths.forEach((p) => {
            this.registerModule('./core/' + p);
        });
        extPaths.forEach((p) => {
            this.registerModule('./extensions/' + p);
        });
    }

    registerModule(path) {
        new (require(path).default)(this);
    }
} 