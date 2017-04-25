var com = com || {};
com.hiyoko = com.hiyoko || {};
com.hiyoko.sweet = com.hiyoko.sweet || {};

com.hiyoko.sweet.PlayerBattle = function($html, character) {
	this.$html = $html;
	this.id = this.$html.attr('id');
	this.character = character;
	console.log(this)
	this.buildComponents();
};

com.hiyoko.util.extend(com.hiyoko.component.ApplicationBase, com.hiyoko.sweet.PlayerBattle);

com.hiyoko.sweet.PlayerBattle.prototype.buildComponents = function() {
	this.options = new com.hiyoko.sweet.Battle.OptionalValues(this.getElementById('option'));
	this.weapons = new com.hiyoko.sweet.PlayerBattle.Weapons(this.getElementById('weapons'), this.character);
	this.magics = new com.hiyoko.sweet.PlayerBattle.Magics(this.getElementById('magics'), this.character);
};