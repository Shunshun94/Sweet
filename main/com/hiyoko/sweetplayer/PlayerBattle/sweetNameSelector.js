var com = com || {};
com.hiyoko = com.hiyoko || {};
com.hiyoko.sweet = com.hiyoko.sweet || {};
com.hiyoko.sweet.PlayerBattle = com.hiyoko.sweet.PlayerBattle || {};

com.hiyoko.sweet.PlayerBattle.NameSelector = function($html) {
	this.$html = $($html);
	this.id = this.$html.attr('id');
	
	this.body = this.getElementById('body');
	this.overlay = this.getElementById('overlay');
	this.list = new com.hiyoko.sweet.Battle.CounterRemoCon.List(this.getElementById('body-list'));
	
	this.buildComponents();
	this.bindEvents();
};

com.hiyoko.util.extend(com.hiyoko.component.ApplicationBase, com.hiyoko.sweet.PlayerBattle.NameSelector);

com.hiyoko.sweet.PlayerBattle.NameSelector.prototype.decide = function(e) {
	var resultText = this.list.getValue().filter(function(c) {
		return c.check;
	}).map(function(c) {
		return c.text
	});
	this.body.hide();
	this.overlay.hide();
	if(resultText) {
		this.resolve(resultText);
	} else {
		this.reject();
	}
};

com.hiyoko.sweet.PlayerBattle.NameSelector.prototype.cancel = function(e) {
	this.body.hide();
	this.overlay.hide();
	this.reject();
};

com.hiyoko.sweet.PlayerBattle.NameSelector.prototype.open = function(list, resolve, reject) {
	this.list.buildList(list.map(function(c){
		return {type: 'leaf', value: c, text:c}
	}));

	this.resolve = resolve;
	this.reject = reject;
	this.body.show();
	this.overlay.show();
};

com.hiyoko.sweet.PlayerBattle.NameSelector.prototype.bindEvents = function() {
	this.getElementById('body-exec').click(this.decide.bind(this));
	this.getElementById('body-cancel').click(this.cancel.bind(this));
};


