var com = com || {};
com.hiyoko = com.hiyoko || {};
com.hiyoko.sweet = com.hiyoko.sweet || {};
com.hiyoko.sweet.PlayerBattle = com.hiyoko.sweet.PlayerBattle || {};

com.hiyoko.sweet.PlayerBattle.Magics = function($html, character) {
	this.$html = $html;
	this.id = this.$html.attr('id');
	this.magics = character.magic;
};

com.hiyoko.util.extend(com.hiyoko.component.ApplicationBase, com.hiyoko.sweet.PlayerBattle.Magics);
