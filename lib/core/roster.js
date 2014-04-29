/**
    Handles presence updates and initial roster retrieval
    Events:
        - 'roster', roster
        - 'roster:presenceChange', user
*/
var _ = require('lodash');


export default class {
    constructor(core) {
        this.core = core;

        // set up data
        core.data.roster = {
            map: {},
            groupMap: {},
            groups: []
        }

        // set up listeners
        core.client.on('stanza', this.stanzaListener.bind(this));
        core.client.on('buddy', this.presenceListener.bind(this));
        core.client.on('online', this.onlineListener.bind(this));

    }

    /**
        Once online, get the roster
    */
    onlineListener() {
        this.core.client.getRoster();
        this.core.client.removeListener('online', this.onlineListener);
    }

    /**
        While waiting for the roster, listen for the resoter stanza.
    */
    stanzaListener(stanza) {
        if (stanza.is('iq') && stanza.attrs.id === 'roster_0') {
            this.parseRosterStanza(stanza);
            this.core.client.removeListener('stanza', this.stanzaListener);
        }
    }

    /**
        Listen for presence updates
    */
    presenceListener(jid, state, statusText) {
        console.log("Roster > Presence Update", jid, state, statusText);
        var rosterMap = this.core.data.roster.map;
        if (!rosterMap[jid]) {
            rosterMap[jid] = { jid: jid };
        }
        _.extend(rosterMap[jid], {
            state: state,
            statusText: statusText
        });
        this.core.emit('roster:presenceChange', rosterMap[jid]);
    }

    /**
        Parse the roster stanza into to managable JS objects/collections
    */
    parseRosterStanza(stanza) {
        console.log("Roster > Roster Update", stanza);
        var rosterMap = this.core.data.roster.map;
        var groupMap = this.core.data.roster.groupMap;
        var groupArray = this.core.data.roster.groups;

        // every item is a user
        stanza.getChildren("query")[0].getChildren('item').forEach((item) => {
            var jid = item.attrs.jid;

            if (!rosterMap[jid]) {
                rosterMap[jid] = { jid: jid };
            }

            // map users by JID
            _.extend(rosterMap[jid], {
                name: item.attrs.name,
                state: rosterMap[jid].state || 'offline',
                subscription: item.attrs.subscription,
            });

            // a user can be in multiple groups
            // organize them into a map of groupName:users[]
            var groups = item.getChildren('group');
            if (groups.length) {
                groups.forEach(function (group) {
                    var groupName = group.getText();
                    if (groupMap[groupName]) {
                        groupMap[groupName].push(rosterMap[jid]);
                    } else {
                        groupMap[groupName] = [rosterMap[jid]];
                    }
                });
            } else {
                if (groupMap['No Group']) {
                    groupMap['No Group'].push(rosterMap[jid]);
                } else {
                    groupMap['No Group'] = [rosterMap[jid]];
                }
            }
        });

        // put groups into an array for easier consumption?
        Object.keys(groupMap).forEach(function (key) {
            groupArray.push({
                name: key,
                users: groupMap[key]
            });
        });

        // Add roster object to core data
        this.core.data.roster = {
            map: rosterMap,
            groupMap: groupMap,
            groups: groupArray
        };

        this.core.emit('roster', this.core.data.roster);
    }
}