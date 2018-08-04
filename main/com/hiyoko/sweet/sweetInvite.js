var com = com || {};
com.hiyoko = com.hiyoko || {};
com.hiyoko.sweet = com.hiyoko.sweet || {};
com.hiyoko.sweet.Invite = class extends com.hiyoko.component.ApplicationBase {
	constructor($html, opt = {}) {
		super($html, opt);
		this.LIST_NAME = 'SWEET Invite - 招待';
		this.buildComponents();
	}
	
	buildComponents() {
		this.$html.append(`<h2>PL 用ツールの URL</h2>`);
		this.$html.append(`<p> <code>${location.origin}/player.html${location.search}&sheetId=[キャラクターシートのID]</code></p>`);
		this.$html.append(`<p>例： <code>${location.origin}/player.html${location.search}&sheetId=116063</code></p>`)
	}
};