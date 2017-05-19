var com = com || {};
com.hiyoko = com.hiyoko || {};
com.hiyoko.sweet = com.hiyoko.sweet || {};

com.hiyoko.sweet.Pet = function($html, character) {
	this.$html = $html;
	this.id = this.$html.attr('id');
	this.character = character
	this.LIST_NAME = '騎獣など';
	this.buildComponents();
	this.bindEvents();
};

com.hiyoko.util.extend(com.hiyoko.component.ApplicationBase, com.hiyoko.sweet.Pet);

com.hiyoko.sweet.Pet.prototype.buildComponents = function() {
	
};

com.hiyoko.sweet.Pet.prototype.bindEvents = function() {
	
};