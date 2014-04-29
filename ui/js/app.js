'use strict';
angular.module('ChatApp', ['directives.user', 'luegg.directives', 'emoji', 'ui.keypress', 'ngSanitize', 'xeditable'])
    .run(['$rootScope','$sce', '$sanitize', function ($rootScope, $sce, $sanitize) {

        var _ = require('lodash'),
            traceur = require('traceur');

        traceur.require.makeDefault(function(filename) {
            return !!filename.match(/\.js/g);
        });

        var core = new (require('./../lib/xmpp.js').xmpp)();
        core.connect(require('./../secrets'));

        core.client.on('online', function () {
            $rootScope.online = true;
        });
        core.on('roster:presenceChange', function (user) {
            $rootScope.$apply();
        });
        core.on('roster', function (roster) {
            $rootScope.roster = roster;
            $rootScope.$apply();
        });
        core.on('chatstate', function (jid, state) {
            $rootScope.$apply();
        });

        var chatSound = new Audio('css/pop.wav');
        core.on('message', function (jid, text) {
            chatSound.play();
            $rootScope.$apply(function () {
                var threadMap = $rootScope.threadMap;

                // make a msg object
                var message = {
                    from: $rootScope.roster.map[jid],
                    timestamp: new Date(),
                    text: text
                };

                // if we don't already have a thread, make one
                if (!threadMap[jid]) {
                    threadMap[jid] = {
                        user: $rootScope.roster.map[jid],
                        messages: [message]
                    };
                } else {
                    // add to existing thread
                    threadMap[jid].messages.push(message);
                }

                // auto-open thread if there isn't one open
                if (!$rootScope.selectedThread) {
                    $rootScope.selectedThread = threadMap[jid];
                } else if ($rootScope.selectedThread !== threadMap[jid]) {
                    // add to unread count if not the current thread
                    threadMap[jid].unreadCount = (threadMap[jid].unreadCount || 0) + 1;
                    global.gui.Window.get().setBadgeLabel(threadMap[jid].unreadCount);
                }

                global.gui.Window.get().requestAttention();
            });
        });

        $rootScope.threadMap = {};
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

        $rootScope.send = function (jid, message) {
            core.client.send(jid, message);
            $rootScope.threadMap[jid].messages.push({
                timestamp: new Date(),
                text: message
            });
        };

        core.client.on('error', function(err) {
            console.error(err);
        });

        core.client.on('close', function() {
            window.alert("connection closed~");
        });
}]);