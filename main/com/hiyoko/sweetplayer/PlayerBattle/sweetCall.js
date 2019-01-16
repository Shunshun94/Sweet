var com = com || {};
com.hiyoko = com.hiyoko || {};
com.hiyoko.sweet = com.hiyoko.sweet || {};
com.hiyoko.sweet.PlayerBattle = com.hiyoko.sweet.PlayerBattle || {};

com.hiyoko.sweet.PlayerBattle.Call = function($html, character) {
	this.$html = $($html);
	this.id = this.$html.attr('id');
	this.character = character;
	
	this.editor = this.getElementById('editor');
	this.send = this.getElementById('send');
	this.sendIdea = this.getElementById('sendidea');
	
	this.buildComponents();
	this.bindEvents();
};

com.hiyoko.util.extend(com.hiyoko.component.ApplicationBase, com.hiyoko.sweet.PlayerBattle.Call);

com.hiyoko.sweet.PlayerBattle.Call.prototype.sendCall = function(isIdea) {
	if(this.editor.val() === ''){return;}
	var text = (isIdea ? '行動宣言 (案)\n' : '行動宣言\n') + this.editor.val();
	var event = this.getAsyncEvent('tofRoomRequest').done(function(r) {
		alertify.success('送信しました');
	}.bind(this)).fail(function(err){
		console.error(err);
		alertify.error(err.message || err || '送信に失敗しました');
	});
	event.args = [{name: this.character.name, message: text}];
	event.method = 'sendChat';
	this.fireEvent(event);
	if(! Boolean(isIdea)) {
		this.editor.val('');
	}	
};

com.hiyoko.sweet.PlayerBattle.Call.prototype.bindEvents = function() {
	this.$html.on(com.hiyoko.sweet.PlayerBattle.Call.Child.Event.ADD, function(e) {
		this.editor.val(this.editor.val() + e.call + '\n');
	}.bind(this));
	
	this.send.click(function(e) {this.sendCall(false);}.bind(this));
	this.sendIdea.click(function(e) {this.sendCall(true);}.bind(this));
};

com.hiyoko.sweet.PlayerBattle.Call.prototype.buildComponents = function() {
	new com.hiyoko.sweet.PlayerBattle.Call.TempTech(this.getElementById('temptech'), this.character.subSkills.tempTech);
	new com.hiyoko.sweet.PlayerBattle.Call.AlchemicCard(this.getElementById('alchemiccard'), this.character.subSkills.alchemicCard);
	new com.hiyoko.sweet.PlayerBattle.Call.LeadersOrder(this.getElementById('leadersorder'), this.character.subSkills.leadersOrder);
	new com.hiyoko.sweet.PlayerBattle.Call.SpellSong(this.getElementById('spellsong'), this.character.subSkills.spellSong);
	new com.hiyoko.sweet.PlayerBattle.Call.FortuneTelling(this.getElementById('fortunetelling'), this.character.subSkills.fortuneTelling);
	new com.hiyoko.sweet.PlayerBattle.Call.SpellSeal(this.getElementById('spellSeal'), this.character.subSkills.spellSeal);
	new com.hiyoko.sweet.PlayerBattle.Call.AristocratDignity(this.getElementById('aristocratDignity'), this.character.subSkills.aristocratDignity);
	new com.hiyoko.sweet.PlayerBattle.Call.Move(this.getElementById('move'));
};

com.hiyoko.sweet.PlayerBattle.Call.Child = function() {};
com.hiyoko.util.extend(com.hiyoko.component.ApplicationBase, com.hiyoko.sweet.PlayerBattle.Call.Child);
com.hiyoko.sweet.PlayerBattle.Call.Child.Event = {
	ADD: 'com-hiyoko-sweet-PlayerBattle-Call-Child-Event-ADD'
};
com.hiyoko.sweet.PlayerBattle.Call.Child.prototype.getText = function() {throw('getText method must be implemented.')};

com.hiyoko.sweet.PlayerBattle.Call.Child.prototype.getCharacters = function() {
	var event = this.getAsyncEvent(com.hiyoko.sweet.PlayerBattle.Events.charList).done(function(r){
		this.getElementById('target').text(' ＞ ' + r.join(', '));
	}.bind(this)).fail(function(r) {
		this.getElementById('target').text('');
	}.bind(this));
	event.method = 'getCharacters';
	this.fireEvent(event);
};

com.hiyoko.sweet.PlayerBattle.Call.Child.prototype.bindCommonEvents = function() {
	this.getElementById('send').click(function(e){
		this.fireEvent({type: com.hiyoko.sweet.PlayerBattle.Call.Child.Event.ADD, call: this.getText()});
	}.bind(this));
	this.getElementById('getCharacterList').click(this.getCharacters.bind(this));
};

com.hiyoko.sweet.PlayerBattle.Call.Child.prototype.buildComponents = function() {
	if(this.list.length) {
		var $list = this.getElementById('list');
		this.list.forEach(function(v, i){
			$list.append(com.hiyoko.util.format('<option value="%s">%s</option>',i, v.name));
		});
	} else {
		this.disable();
	}
};

com.hiyoko.sweet.PlayerBattle.Call.Move = function($html) {
	this.$html = $($html);
	this.id = this.$html.attr('id');

	this.bindEvents();
	this.bindCommonEvents();
};
com.hiyoko.util.extend(com.hiyoko.sweet.PlayerBattle.Call.Child, com.hiyoko.sweet.PlayerBattle.Call.Move);

com.hiyoko.sweet.PlayerBattle.Call.Move.prototype.getText = function() {
	var moveText;
	var elem = this.getElementById('action').val();
	if(elem === 'から手前') {
		moveText = this.getElementById('target').text().replace(' ＞ ', '') + elem + this.getElementById('distance').val() + 'mに移動';
	} else if (elem === 'に近接') {
		moveText = this.getElementById('target').text().replace(' ＞ ', '') + elem;
	} else {
		moveText = this.getElementById('distance').val() + 'm' + elem;
	}
	
	return com.hiyoko.util.format('%sで%s', this.getElementById('list').val(), moveText);
};

com.hiyoko.sweet.PlayerBattle.Call.Move.prototype.bindEvents = function() {
	this.getElementById('action').change(function(e) {
		var elem = $(e.target).val();
		if(elem === 'から手前') {
			this.getCharacters();
			this.getElementById('distance').show();
		} else if (elem === 'に近接') {
			this.getCharacters();
			this.getElementById('distance').hide();
		} else {
			this.getElementById('target').text(' ');
			this.getElementById('distance').show();
		}
	}.bind(this));
};

com.hiyoko.sweet.PlayerBattle.Call.TempTech = function($html, list) {
	this.$html = $($html);
	this.id = this.$html.attr('id');
	this.list = list.filter(function(v){return v.name;});

	this.buildComponents();
	this.bindCommonEvents();
};
com.hiyoko.util.extend(com.hiyoko.sweet.PlayerBattle.Call.Child, com.hiyoko.sweet.PlayerBattle.Call.TempTech);

com.hiyoko.sweet.PlayerBattle.Call.TempTech.prototype.getText = function() {
	var tech = this.list[this.getElementById('list').val()];
	return com.hiyoko.util.format('練技 %s%s | %s ', tech.name, this.getElementById('target').text(), tech.effect) + (tech.time ? '(' + tech.time + ')' : '');
};

com.hiyoko.sweet.PlayerBattle.Call.AlchemicCard = function($html, list) {
	this.$html = $($html);
	this.id = this.$html.attr('id');
	this.list = list.filter(function(v){return v.name;});

	this.buildComponents();
	this.bindCommonEvents();
};
com.hiyoko.util.extend(com.hiyoko.sweet.PlayerBattle.Call.Child, com.hiyoko.sweet.PlayerBattle.Call.AlchemicCard);

com.hiyoko.sweet.PlayerBattle.Call.AlchemicCard.prototype.getText = function() {
	var tech = this.list[this.getElementById('list').val()];
	return com.hiyoko.util.format('賦術 %s (%s)%s | %s %s',
			tech.name, this.getElementById('size').val(), this.getElementById('target').text(),
			tech.effect, tech.size[this.getElementById('size').val()]);
};

com.hiyoko.sweet.PlayerBattle.Call.LeadersOrder = function($html, list) {
	this.$html = $($html);
	this.id = this.$html.attr('id');
	this.list = list.filter(function(v){return v.name;});

	this.buildComponents();
	this.bindCommonEvents();	
};
com.hiyoko.util.extend(com.hiyoko.sweet.PlayerBattle.Call.Child, com.hiyoko.sweet.PlayerBattle.Call.LeadersOrder);

com.hiyoko.sweet.PlayerBattle.Call.LeadersOrder.prototype.getText = function() {
	var tech = this.list[this.getElementById('list').val()];
	return com.hiyoko.util.format('鼓咆 %s (%s%s) | %s',
			tech.name, tech.type, tech.rank, tech.effect);
};

com.hiyoko.sweet.PlayerBattle.Call.SpellSong = function($html, list) {
	this.$html = $($html);
	this.id = this.$html.attr('id');
	this.list = list.filter(function(v){return v.name;});

	this.buildComponents();
	this.bindCommonEvents();	
};
com.hiyoko.util.extend(com.hiyoko.sweet.PlayerBattle.Call.Child, com.hiyoko.sweet.PlayerBattle.Call.SpellSong);

com.hiyoko.sweet.PlayerBattle.Call.SpellSong.prototype.getText = function() {
	var tech = this.list[this.getElementById('list').val()];
	return com.hiyoko.util.format('呪歌 %s | %s',
			tech.name, tech.effect);
};

com.hiyoko.sweet.PlayerBattle.Call.FortuneTelling = function($html, list) {
	this.$html = $($html);
	this.id = this.$html.attr('id');
	this.list = list.filter(function(v){return v.name;});

	this.buildComponents();
	this.bindCommonEvents();
};
com.hiyoko.util.extend(com.hiyoko.sweet.PlayerBattle.Call.Child, com.hiyoko.sweet.PlayerBattle.Call.FortuneTelling);

com.hiyoko.sweet.PlayerBattle.Call.FortuneTelling.prototype.getText = function() {
	var tech = this.list[this.getElementById('list').val()];
	return com.hiyoko.util.format('占瞳 %s%s | %s ', tech.name, this.getElementById('target').text(), tech.effect);
};

com.hiyoko.sweet.PlayerBattle.Call.SpellSeal = function($html, list) {
	this.$html = $($html);
	this.id = this.$html.attr('id');
	this.list = list.filter(function(v){return v.name;});

	this.buildComponents();
	this.bindCommonEvents();	
};
com.hiyoko.util.extend(com.hiyoko.sweet.PlayerBattle.Call.Child, com.hiyoko.sweet.PlayerBattle.Call.SpellSeal);

com.hiyoko.sweet.PlayerBattle.Call.SpellSeal.prototype.getText = function() {
	var tech = this.list[this.getElementById('list').val()];
	return com.hiyoko.util.format('呪印アクティベート %s | %s',
			tech.name, tech.effect);
};

com.hiyoko.sweet.PlayerBattle.Call.AristocratDignity = function($html, list) {
	this.$html = $($html);
	this.id = this.$html.attr('id');
	this.list = list.filter(function(v){return v.name;});

	this.buildComponents();
	this.bindCommonEvents();	
};
com.hiyoko.util.extend(com.hiyoko.sweet.PlayerBattle.Call.Child, com.hiyoko.sweet.PlayerBattle.Call.AristocratDignity);

com.hiyoko.sweet.PlayerBattle.Call.AristocratDignity.prototype.getText = function() {
	var tech = this.list[this.getElementById('list').val()];
	return com.hiyoko.util.format('貴格 %s | %s',
			tech.name, tech.effect);
};
