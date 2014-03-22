'use strict';
angular.module('ChatApp', ['directives.user'])
    .run(['$rootScope', function ($rootScope) {

        var xmpp = require('simple-xmpp'),
            _ = require('lodash');

        $rootScope.rosterMap = {};
        $rootScope.threadMap = {}
        $rootScope.groups = [];
        $rootScope.online = false;

        $rootScope.getThreadForUser = function (user) {
            var threadMap = $rootScope.threadMap;

            // if we don't have a thread, make one
            if (!threadMap[user.jid]) {
                return threadMap[user.jid] = {
                    user: user,
                    messages: []
                }
            } else {
                // use existing thread
                return threadMap[user.jid];
            }
        };

        xmpp.on('online', function() {
            $rootScope.online = true;
            console.log('Connected');
        });

        xmpp.on('chat', function(jid, text) {
            var threadMap = $rootScope.threadMap;

            // make a msg object
            var message = {
                timestamp: new Date(),
                text: text
            };

            // if we don't already have a thread, make one
            if (!threadMap[jid]) {
                threadMap[jid] = {
                    user: $rootScope.rosterMap[jid],
                    messages: [message]
                };
            } else {
                // add to existing thread
                threadMap[jid].messages.push(message);
            }

            console.log(jid, message);
        });

        xmpp.on('error', function(err) {
            console.error(err);
        });

        xmpp.on('stanza', function (stanza) {
            // $apply so that views update
            $rootScope.$apply(function () {
                // check if it's roster stanza
                if (stanza.is('iq') && stanza.attrs.id === 'roster_0') {
                    parseRosterStanza(stanza);
                } else if (stanza.is('presence')) {
                    // this calls .on('buddy')
                } else {
                    console.log("Unknown Stanza: " + stanza);
                }
            });
        });

        xmpp.on('buddy', function(jid, state, statusText) {
            var rosterMap = $rootScope.rosterMap;

            // user may or may not already exist
            if (!rosterMap[jid]) {
                rosterMap[jid] = {
                    jid: jid
                };
            }

            // extend new info on to it
             _.extend(rosterMap[jid], {
                state: state,
                statusText: statusText
             });
        });

        xmpp.connect(require('./../secrets'));

        function parseRosterStanza(stanza) {
            var rosterMap = $rootScope.rosterMap;
            var groupMap = {};

            // every item is a user
            stanza.getChildren("query")[0].getChildren('item').forEach(function (item) {
                var jid = item.attrs.jid;

                // they might already exist from a presense update, so maintain that
                if (!rosterMap[jid]) { 
                    rosterMap[jid] = {
                        jid: jid
                    }; 
                }

                // map users by JID
                 _.extend(rosterMap[jid], {
                    name: item.attrs.name,
                    state: rosterMap[jid].state || 'offline',
                    subscription: item.attrs.subscription,
                });

                // a user can be in multiple groups
                // organize them into a map
                var groups = item.getChildren('group');
                groups.forEach(function (group) {
                    var groupName = group.getText();
                    if (groupMap[groupName]) {
                        groupMap[groupName].push(rosterMap[jid]);
                    } else {
                        groupMap[groupName] = [rosterMap[jid]];
                    }
                });
            });

            // tnow put the groups into an array
            Object.keys(groupMap).forEach(function (key) {
                $rootScope.groups.push({
                    name: key,
                    users: groupMap[key]
                });
            });
        }

        // get the user's roster
        // TODO: cache
        xmpp.getRoster();
}]);