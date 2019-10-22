var com = com || {};
com.hiyoko = com.hiyoko || {};
com.hiyoko.sweet = com.hiyoko.sweet || {};
com.hiyoko.sweet.Player = com.hiyoko.sweet.Player || {};
com.hiyoko.sweet.SelectBot = class extends com.hiyoko.component.ApplicationBase {
	constructor($html, opt = {}) {
		super($html, opt);
		var event = this.getAsyncEvent('tofRoomRequest').done((result)=>{
			const tabLength = result.chatTab.length;
			this.$html.append(`ソードワールド 2.5 のダイスボットを使う <input type="checkbox" id="${this.id}-isTwoPointFive" ${(opt.character.system === '2.5') ? 'checked' : ''} /><br/>`);
			this.$html.append(`ダイスコマンド送信先のタブ <select id="${this.id}-tab">${this.generateTabHtml(result.chatTab)}</select>`);
			this.getElementById('tab').change((d)=>{
				const currentTab = this.getTab();
				if(currentTab) {
					this.$html.css('background-color', `hsl(${(360) * (this.getTab() / tabLength)}, 100%, 85%)`);
				} else {
					this.$html.css('background-color', 'transparent');
				}
			});
		}).fail((reuslt)=>{
			console.error(result);
		});
		event.method = 'getRoomInfo';
		this.fireEvent(event);
	}

	generateTabHtml(tabs) {
		return tabs.map((v, i)=>{return `<option value="${i}">${v}</option>`}).join('');
	}
	getTab() {
		return Number(this.getElementById('tab').val());
	}
	getBot(opt_default = com.hiyoko.sweet.SelectBot.BOTS.TWO_POINT_ZERO) {
		if(this.getElementById('isTwoPointFive').prop('checked')) {
			return com.hiyoko.sweet.SelectBot.BOTS.TWO_POINT_FIVE;
		} else {
			return com.hiyoko.sweet.SelectBot.BOTS.TWO_POINT_ZERO;
		}
	}
}

com.hiyoko.sweet.SelectBot.BOTS = {
	TWO_POINT_ZERO: 'SwordWorld2.0',
	TWO_POINT_FIVE: 'SwordWorld2.5'
};