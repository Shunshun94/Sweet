var com = com || {};
com.hiyoko = com.hiyoko || {};
com.hiyoko.sweet = com.hiyoko.sweet || {};
com.hiyoko.sweet.PlayerBattle = com.hiyoko.sweet.PlayerBattle || {};

com.hiyoko.sweet.PlayerBattle.Magics = function($html, character) {
	this.$html = $html;
	this.id = this.$html.attr('id');
	this.magics = [];
	com.hiyoko.util.forEachMap(character.magic, function(v, k){
		this.magics.push({name: k, value: v});
	}.bind(this));
	this.forRider(character);
	this.buildComponents();
	this.bindEvents();
};

com.hiyoko.util.extend(com.hiyoko.component.ApplicationBase, com.hiyoko.sweet.PlayerBattle.Magics);

com.hiyoko.sweet.PlayerBattle.Magics.prototype.forRider = function(character) {
	[{skill: 'ライダー', name: '騎獣の車載武器'},
	 {skill: 'エンハンサー', name: '練技による攻撃'}].filter(function(w){
		return character.skills[w.skill];
	 }).forEach(function(w){
		 this.magics.push({name:w.name,value:character.skills[w.skill] + character.status[4]});
	 }.bind(this));
};

com.hiyoko.sweet.PlayerBattle.Magics.prototype.buildComponents = function() {
	if(this.magics.length === 0) {
		this.disable();
		return;
	}
	
	var list = this.getElementById('list');
	this.magics.forEach(function(v, i) {
		list.append(com.hiyoko.util.format('<option value="%s">%s (魔力 %s)</option>',i, v.name, v.value));
	});
};

com.hiyoko.sweet.PlayerBattle.Magics.prototype.bindEvents = function() {
	var list = this.getElementById('list');
	
	this.getElementById('getCharacterList').click(function(e) {
		var event = this.getAsyncEvent(com.hiyoko.sweet.PlayerBattle.Events.charList).done(function(r){
			this.getElementById('memo').val(this.getElementById('memo').val() + ' ＞ ' + r);
		}.bind(this)).fail(function(r) {
			// No Action
		});
		event.method = 'getCharacters';
		this.fireEvent(event);
	}.bind(this));
	
	this.getElementById('hitexec').click(function(e) {
		var magic = this.magics[list.val()];
		this.fireEvent({
			target: e.target,
			type: com.hiyoko.sweet.PlayerBattle.Events.role,
			message: com.hiyoko.util.format('2d6+%s\\%s / 行使判定 ：%s %s', magic.value, magic.name, this.getElementById('memo').val()),
			col: 7
		});
	}.bind(this));
	
	this.getElementById('damexec').click(function(e) {
		var magic = this.magics[list.val()];
		this.fireEvent({
			target: e.target,
			type: com.hiyoko.sweet.PlayerBattle.Events.role,
			message: com.hiyoko.util.format('k%s+%s\\%s\\%s%s%s / ダメージ ：%s %s',
					this.getElementById('rate').val(),
					magic.value,
					this.getElementById('critical').val(),
					this.getElementById('rolevalue').val(),
					magic.name, this.getElementById('memo').val()),
			col: [3, 7]
		});
	}.bind(this));

	this.getElementById('memo-clear').click(function(e) {
		this.getElementById('memo').val('');
		this.getElementById('memo').focus();
	}.bind(this));
};
