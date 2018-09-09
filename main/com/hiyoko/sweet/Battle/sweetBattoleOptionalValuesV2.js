var com = com || {};
com.hiyoko = com.hiyoko || {};
com.hiyoko.sweet = com.hiyoko.sweet || {};
com.hiyoko.sweet.Battle = com.hiyoko.sweet.Battle || {};

com.hiyoko.sweet.Battle.OptionalValues = class extends com.hiyoko.component.ApplicationBase {
	constructor($html, opt = {}) {
		super($html, opt);
		
		this.buildDom();
		
		this.$table = this.getElementById('table');
		this.$toggle = this.getElementById('toggle');
		this.$summary = this.getElementById('summary');
	}
	
	buildDom() {
		
	}
};