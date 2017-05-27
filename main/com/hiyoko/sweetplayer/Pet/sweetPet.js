var com = com || {};
com.hiyoko = com.hiyoko || {};
com.hiyoko.sweet = com.hiyoko.sweet || {};

com.hiyoko.sweet.Pet = function($html, character) {
	this.$html = $html;
	this.id = this.$html.attr('id');
	this.petCharacter = character.pets.character;
	this.petParts = character.pets.parts;
	this.pets = {};
	this.LIST_NAME = '騎獣など';
	this.buildComponents();
	this.bindEvents();
};

com.hiyoko.util.extend(com.hiyoko.component.ApplicationBase, com.hiyoko.sweet.Pet);

com.hiyoko.sweet.Pet.prototype.buildComponents = function() {
	if(this.petCharacter.length) {
		this.petCharacter.forEach(function(v, i) {
			this.getElementById('characterList').append(com.hiyoko.util.format('<option value="%s">%s</option>', i, v.name));
		}.bind(this));
		this.table = new com.hiyoko.sweet.Battle.OptionalValues(this.getElementById('options'));
	} else {
		this.getElementById('characterList').parent().hide();
		this.$html.append('<p>騎獣やゴーレムがいません</p>');
	}
};

com.hiyoko.sweet.Pet.prototype.bindEvents = function() {
	this.getElementById('characterAppend').click(this.appendCharacter.bind(this));
	this.$html.on('executeRequest', this.sendCommand.bind(this));
};

com.hiyoko.sweet.Pet.prototype.sendCommand = function(e) {
	var event = this.getAsyncEvent('tofRoomRequest').done(function(r){
		$(e.target).notify('ダイスが振られました', {className: 'success', position: 'top'});
	}.bind(this)).fail(function(r){
		alert('ダイスを振るのに失敗しました\n' + r.result);
	});
	var option = this.table.getOptionalValue(e.col);
	
	var text = com.hiyoko.util.format('%s%s / %s%s', e.value, option.value, e.text, option.detail);
	event.args = [{name: e.name, message: text, bot:'SwordWorld2.0'}];
	event.method = 'sendChat';
	this.fireEvent(event);
};

com.hiyoko.sweet.Pet.prototype.appendCharacter = function() {
	var newId = com.hiyoko.util.rndString(8);
	var character = this.petCharacter[this.getElementById('characterList').val()];
	var render = com.hiyoko.sweet.Pet.Character.render.bind(this);
	this.getElementById('characters').append(render(newId));
	
	this.pets[newId] = new com.hiyoko.sweet.Pet.Character(this.getElementById('character-' + newId),
			this.petCharacter[this.getElementById('characterList').val()], this.petParts);
};


