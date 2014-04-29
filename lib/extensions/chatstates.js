/**
    XMP-0085 Chatstates extension
    http://xmpp.org/extensions/xep-0085.html

    Events:
        - 'chatstate', id, state
*/

var NS_CHATSTATE = 'http://jabber.org/protocol/chatstates';

export default class {
    constructor(core) {
        this.core = core;
        core.client.on('stanza', this.stanzaListener.bind(this));
    }

    stanzaListener(stanza) {
        if (stanza.is('message') && stanza.attrs.type == 'chat') {
            var chatState = stanza.getChildByAttr('xmlns:cha', NS_CHATSTATE) || stanza.getChildByAttr('xmlns', NS_CHATSTATE);
            if (chatState) {
                var rosterMap = this.core.data.roster.map,
                    jid = stanza.attrs.from.split('/')[0],
                    state = chatState.name;

                if (state.indexOf('cha:') === 0) {
                    state = state.substr(4);
                }

                // if the user's in the roster, set it
                if (rosterMap[jid]) {
                    rosterMap[jid].chatState = state;
                }
                this.core.emit('chatstate', jid, state);

                console.log("Chatstate > Received", jid, state);
            }
         }
    }
}