var com = com || {};
com.hiyoko = com.hiyoko || {};
com.hiyoko.sweet = com.hiyoko.sweet || {};
com.hiyoko.sweet.ResponseChat = class extends com.hiyoko.component.ApplicationBase {
	constructor($html, options = {}) {
		super($html, options);
		this.getElementById('chat').append(io.github.shunshun94.trpg.ResponseChat.generateDom(`${this.id}-chat-chat`));
		this.chat = new io.github.shunshun94.trpg.ResponseChat(this.getElementById('chat-chat'), {
			displayLimit: 15
		});
		this.getElementById('toggle').click((e) => {
			this.getElementById('chat').toggle(300);
		});
		
	}
}