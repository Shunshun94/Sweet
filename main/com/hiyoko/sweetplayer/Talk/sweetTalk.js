var com = com || {};
com.hiyoko = com.hiyoko || {};
com.hiyoko.sweet = com.hiyoko.sweet || {};

com.hiyoko.sweet.Talk = function($html, character, query) {
	this.$html = $html;
	this.id = this.$html.attr('id');
	this.character = character;
	this.msgConverte = query.platform === 'discord' ? com.hiyoko.DodontoF.V2.converteLog : false;
	this.initialize();
	this.bindEvents();
};

com.hiyoko.util.extend(com.hiyoko.component.ApplicationBase, com.hiyoko.sweet.Talk);

com.hiyoko.sweet.Talk.prototype.initialize = function() {
	this.$html.show();
	this.chat = new com.hiyoko.DodontoF.V2.ChatClient(this.getElementById('chat'), {
		displayLimit: 10,
		name: this.character.name,
		system: 'SwordWorld2.0',
		msgConverte: this.msgConverte
	}); 
};

com.hiyoko.sweet.Talk.prototype.bindEvents = function() {
	this.getElementById('toggle').click(function(e) {
		if(this.getElementById('chat').css('display') !== 'none') {
			this.getElementById('toggle').text('💬');
		} else {
			this.getElementById('toggle').text('×');
		}

		this.getElementById('chat').toggle(300);
	}.bind(this));
};

