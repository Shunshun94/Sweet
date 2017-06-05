var com = com || {};
com.hiyoko = com.hiyoko || {};
com.hiyoko.sweet = com.hiyoko.sweet || {};

com.hiyoko.sweet.Pet = function($html, character) {
	this.$html = $html;
	this.id = this.$html.attr('id');
	this.masterName = character.name;
	this.ownerId = character.id;
	this.petCharacter = character.pets.character;
	this.petParts = character.pets.parts;
	this.pets = {};
	this.LIST_NAME = '騎獣など';
	this.buildComponents();
	this.bindEvents();
};

com.hiyoko.util.extend(com.hiyoko.component.ApplicationBase, com.hiyoko.sweet.Pet);

com.hiyoko.sweet.Pet.prototype.setPrefixDom = function() {
	var event = this.getAsyncEvent('getStorageWithKey').done(function(str) {
		this.getElementById('prefix').val(str || this.masterName);
	}.bind(this));
	event.id = this.id + '-prefix';
	event.key = this.ownerId;
	this.fireEvent(event);
};

com.hiyoko.sweet.Pet.prototype.lockPrefix = function() {
	this.getElementById('prefix').hide();
	this.getElementById('prefixExplain').hide();
	this.masterName = this.getElementById('prefix').val();
	var event = this.getAsyncEvent('setStorageWithKey').done(function() {});
	event.id = this.id + '-prefix';
	event.key = this.ownerId;
	event.value = this.masterName;
	this.fireEvent(event);
};

com.hiyoko.sweet.Pet.prototype.buildComponents = function() {
	if(this.petCharacter.length) {
		this.petCharacter.forEach(function(v, i) {
			this.getElementById('characterList').append(com.hiyoko.util.format('<option value="%s">%s</option>', i, v.name));
		}.bind(this));
		this.table = new com.hiyoko.sweet.Battle.OptionalValues(this.getElementById('options'));
		this.setPrefixDom();
	} else {
		this.getElementById('characterList').parent().hide();
		this.$html.append('<p>騎獣やゴーレムがいません</p>');
	}
};

com.hiyoko.sweet.Pet.prototype.bindEvents = function() {
	this.getElementById('characterAppend').click(this.appendCharacter.bind(this));
	this.$html.on('executeRequest', this.sendCommand.bind(this));
	this.$html.on('executeAddCharacters', this.appendCharacterToTof.bind(this));
	this.$html.on('executeUpdateCharacters', this.updateCharacterToTof.bind(this));
};

com.hiyoko.sweet.Pet.prototype.updateCharacterToTof = function(e) {
	var event = this.getAsyncEvent('tofRoomRequest').done(e.resolve).fail(e.reject);
	event.method = 'updateCharacter';
	e.parts.forEach(function(p){
		event.args = [{
			targetName: e.name + ':' + p.name,
			HP: p.hp,
			MP: p.mp,
			'防護点': p.armor
		}];
		this.fireEvent(event);
	}.bind(this));
};


com.hiyoko.sweet.Pet.prototype.appendCharacterToTof = function(e) {
	var event = this.getAsyncEvent('tofRoomRequest').done(e.resolve).fail(e.reject);
	event.method = 'addCharacter';
	e.parts.forEach(function(p){
		event.args = [{
			name: e.name + ':' + p.name,
			HP: p.hp,
			MP: p.mp,
			'防護点': p.armor,
			info:com.hiyoko.sweet.Pet.SIGNATURE
		}];
		this.fireEvent(event);
	}.bind(this));
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

com.hiyoko.sweet.Pet.prototype.removeCharacterFromList = function() {
	this.getElementById('characterList').find(':selected').remove();
	if(this.getElementById('characterList').children().length === 0) {
		this.getElementById('characterList').hide();
		this.getElementById('characterAppend').hide();
	}
};

com.hiyoko.sweet.Pet.prototype.appendCharacter = function() {
	this.lockPrefix();
	var newId = com.hiyoko.util.rndString(8);
	var character = this.petCharacter[this.getElementById('characterList').val()];
	var render = com.hiyoko.sweet.Pet.Character.render.bind(this);
	this.getElementById('characters').append(render(newId));
	var index = 2;
	var baseName = this.masterName + '_' + this.getElementById('characterList').find(':selected').text();
	character.name = baseName;
	
	for(var key in this.pets) {
		if(this.pets[key].getName() === character.name) {
			character.name = baseName + '_' + index;
		}
		index++;
	}

	this.pets[newId] = new com.hiyoko.sweet.Pet.Character(this.getElementById('character-' + newId), character, this.petParts);
};

com.hiyoko.sweet.Pet.SIGNATURE = 'By PCSweet Pets';
