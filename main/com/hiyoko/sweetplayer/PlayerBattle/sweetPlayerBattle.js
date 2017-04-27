var com = com || {};
com.hiyoko = com.hiyoko || {};
com.hiyoko.sweet = com.hiyoko.sweet || {};

com.hiyoko.sweet.PlayerBattle = function($html, character) {
	this.$html = $html;
	this.id = this.$html.attr('id');
	this.character = character;
	console.log(this)
	this.buildComponents();
	this.bindEvents();
};

com.hiyoko.util.extend(com.hiyoko.component.ApplicationBase, com.hiyoko.sweet.PlayerBattle);

com.hiyoko.sweet.PlayerBattle.prototype.buildComponents = function() {
	this.options = new com.hiyoko.sweet.Battle.OptionalValues(this.getElementById('option'));
	this.weapons = new com.hiyoko.sweet.PlayerBattle.Weapons(this.getElementById('weapons'), this.character);
	this.magics = new com.hiyoko.sweet.PlayerBattle.Magics(this.getElementById('magics'), this.character);
	this.response = new com.hiyoko.sweet.PlayerBattle.Response(this.getElementById('response'), this.character);
};

com.hiyoko.sweet.PlayerBattle.prototype.bindEvents = function() {
	this.$html.on(com.hiyoko.sweet.PlayerBattle.Events.event, function(e){
		var event = this.getAsyncEvent('tofRoomRequest').done(function(r){
			$(e.target).notify('ダイスが振られました', {className: 'success', position: 'top'});
		}.bind(this)).fail(function(r){
			alert('ダイスを振るのに失敗しました\n' + r.result);
		});
		
		var options = this.options.getOptionalValue(e.col);
		var text = com.hiyoko.util.format(e.message, options.value) + options.detail;
		
		event.args = [{name: this.character.name, message: text, bot:'SwordWorld2.0'}];
		event.method = 'sendChat';
		this.fireEvent(event);
	}.bind(this));
	

};

com.hiyoko.sweet.PlayerBattle.Events = {};
com.hiyoko.sweet.PlayerBattle.Events.event = 'com-hiyoko-sweet-PlayerBattle-Events-event';
