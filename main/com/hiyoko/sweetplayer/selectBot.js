var com = com || {};
com.hiyoko = com.hiyoko || {};
com.hiyoko.sweet = com.hiyoko.sweet || {};
com.hiyoko.sweet.Player = com.hiyoko.sweet.Player || {};
com.hiyoko.sweet.SelectBot = class extends com.hiyoko.component.ApplicationBase {
	constructor($html, opt = {}) {
		super($html, opt);
		this.$html.append(`ソードワールド 2.5 のダイスボットを使う <input type="checkbox" id="${this.id}-isTwoPointFive" />`);
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