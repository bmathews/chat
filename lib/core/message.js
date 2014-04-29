/**
    Message extension
    Events
        - 'message', jid, message

*/
export default class {
    constructor(core) {
        this.core = core;
        core.client.on('stanza', this.stanzaListener.bind(this));
    }

    stanzaListener(stanza) {
        if (stanza.is('message') && stanza.attrs.type == 'chat') {
            var body = stanza.getChild('body');
            if (body) {
                var message = body.getText();
                var jid = stanza.attrs.from.split('/')[0];
                this.core.emit('message', jid, message);

                console.log("Message > Received", jid, message);
            }
        }
    }
}