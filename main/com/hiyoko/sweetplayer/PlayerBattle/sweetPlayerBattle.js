var com = com || {};
com.hiyoko = com.hiyoko || {};
com.hiyoko.sweet = com.hiyoko.sweet || {};

com.hiyoko.sweet.PlayerBattle = function($html, character, query) {
	this.$html = $html;
	this.id = this.$html.attr('id');
	this.character = character;
	this.LIST_NAME = '戦闘';
	this.buildComponents();
	this.bindEvents();
};

com.hiyoko.util.extend(com.hiyoko.component.ApplicationBase, com.hiyoko.sweet.PlayerBattle);

com.hiyoko.sweet.PlayerBattle.prototype.buildComponents = function() {
	this.options = new com.hiyoko.sweet.PlayerBattle.OptionalValues(this.getElementById('option'));
	this.weapons = new com.hiyoko.sweet.PlayerBattle.Weapons(this.getElementById('weapons'), this.character);
	this.magics = new com.hiyoko.sweet.PlayerBattle.Magics(this.getElementById('magics'), this.character);
	this.response = new com.hiyoko.sweet.PlayerBattle.Response(this.getElementById('response'), this.character);
	this.call = new com.hiyoko.sweet.PlayerBattle.Call(this.getElementById('call'), this.character);
	this.characterList = new com.hiyoko.sweet.PlayerBattle.NameSelector(this.getElementById('nameSelector'));
};

com.hiyoko.sweet.PlayerBattle.prototype.isDamageEach = function() {
	return this.getElementById('damageAll').prop('checked');
};

com.hiyoko.sweet.PlayerBattle.prototype.getCharacters = function(e) {
	var event = this.getAsyncEvent('tofRoomRequest').done(function(r){
		this.characterList.open(r.characters.filter(function(c){
			return ! Boolean(c.isHide) && c.type === 'characterData';
		}).map(function(c) {
			return c.dogTag ? c.name + '＃' + c.dogTag : c.name;
		}), e.resolve, e.reject);
	}.bind(this));
	event.method = 'getCharacters';
	this.fireEvent(event);
};

com.hiyoko.sweet.PlayerBattle.prototype.sendCommand = function(e){
	var event = this.getAsyncEvent('tofRoomRequest').done(function(r){
		alertify.success('ダイスが振られました');
	}.bind(this)).fail(function(r){
		alertify.error('ダイスを振るのに失敗しました\n' + r.result);
	});

	var options;
	var optionValues = [];

	if(! Array.isArray(e.col)) {
		e.col = [e.col]
	}

	options = e.col.map(function(col) {
		var val = this.options.getOptionalValue(col);
		optionValues.push(val.value);
		return val;
	}.bind(this)).reduce(function(p, c) {
		return {
			detail: com.hiyoko.util.mergeArray(
					p.detail.split('\n'), c.detail.split('\n'), function(pd, cd) {
						var cds = cd.split('　');
						if(cds.length === 1) {
							return cd;
						} else {
							return pd + cds[2];
						}
					}).join('\n')
		}
	});
	optionValues.unshift(e.message);
	const baseCheckText = com.hiyoko.util.format.apply(null, optionValues)
		.replace('#+0 /', ' /')
		.replace('#+0r', 'r')
		.replace(' /', ((e.isDamage && this.getElementById('greatestFortune').prop('checked')) ? 'gf /' : ' /'));
	if(this.getElementById('damageAll').prop('checked') && e.isDamage && e.targetList.length) {
		e.targetList.forEach((target) => {
			const text = baseCheckText + ' ＞ ' + target + options.detail;
			event.args = [{name: this.character.name, message: text, bot:'SwordWorld2.0'}];
			event.method = 'sendChat';
			this.fireEvent(event);
			alertify.message(`ダイスコマンド (${text}) を送信しました`);
		})
	} else {
		const targets = (e.targetList || []).length ? ` ＞ ${e.targetList.join(', ')}` : '';
		const text = baseCheckText + targets + options.detail;
		event.args = [{name: this.character.name, message: text, bot:'SwordWorld2.0'}];
		event.method = 'sendChat';
		alertify.message(`ダイスコマンド (${text}) を送信しました`);
		this.fireEvent(event);
	}
};

com.hiyoko.sweet.PlayerBattle.prototype.bindEvents = function() {
	this.$html.on(com.hiyoko.sweet.PlayerBattle.Events.role, this.sendCommand.bind(this));
	this.$html.on(com.hiyoko.sweet.PlayerBattle.Events.charList, this.getCharacters.bind(this));
};

com.hiyoko.sweet.PlayerBattle.Events = {
	role: 'com-hiyoko-sweet-PlayerBattle-Events-sendCommand',
	charList: 'com-hiyoko-sweet-PlayerBattle-Events-getCharacters'
};
