var com = com || {};
com.hiyoko = com.hiyoko || {};
com.hiyoko.sweet = com.hiyoko.sweet || {};

com.hiyoko.sweet.Battle = function($html, opt_params){
	this.$html = $($html);
	this.LIST_NAME = 'SWEET Battle';
	this.id = this.$html.attr('id');
	this.list = {};
	
	this.buildComponents();
	this.bindEvents();
	

};

com.hiyoko.util.extend(com.hiyoko.sweet.ApplicationBase, com.hiyoko.sweet.Battle);

com.hiyoko.sweet.Battle.prototype.buildComponents = function() {
	this.appendCharacter();	
};

com.hiyoko.sweet.Battle.prototype.bindEvents = function() {};

com.hiyoko.sweet.Battle.prototype.appendCharacter = function() {
	var newId = com.hiyoko.util.rndString(8, '-');
	
	this.$html.append(com.hiyoko.util.format('<div class="%s" id="%s"></div>',
			this.id + '-character',
			this.id + '-character' + newId));
	this.list[newId] = new com.hiyoko.sweet.Battle.BattleCharacter(this.getElementById('character' + newId));
};

