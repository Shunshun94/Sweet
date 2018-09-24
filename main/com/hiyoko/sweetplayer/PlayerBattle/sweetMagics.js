var com = com || {};
com.hiyoko = com.hiyoko || {};
com.hiyoko.sweet = com.hiyoko.sweet || {};
com.hiyoko.sweet.PlayerBattle = com.hiyoko.sweet.PlayerBattle || {};

com.hiyoko.sweet.PlayerBattle.Magics = function($html, character) {
	this.$html = $html;
	this.id = this.$html.attr('id');
	this.magics = [];
	this.targetList = [];
	com.hiyoko.util.forEachMap(character.magic, function(v, k){
		this.magics.push({name: k, value: v, exceeded: com.hiyoko.sweet.PlayerBattle.Magics.isExceeded(k, character.skills)});
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
		this.magics.push({
			name:w.name,value:character.skills[w.skill] + character.status[4],
			exceeded: character.skills[w.skill] > 15
		});
	 }.bind(this));
	[{skill: 'バード', name:'呪歌'},
	 {skill: 'バード', name:'終律'}].filter((w) => {
		return character.skills[w.skill];
	}).forEach(function(w){
		this.magics.push({
			name:w.name,value:character.skills[w.skill] + character.status[5],
			exceeded: character.skills[w.skill] > 15
		});
	}.bind(this));
	if(character.race.startsWith('ドレイク') || character.race === 'バジリスク' || character.race === 'ウィークリング') {
		this.magics.push({
			name:'ブレス', value:character.level + character.status[3],
			exceeded: character.level > 15
		});
		this.magics.push({
			name:'目線', value:character.level + character.status[5],
			exceeded: character.level > 15
		});
	}

	if(character.skills['バード']) {
		this.getElementById('bard-musicElement').show();
	} else {
		this.getElementById('bard-musicElement').hide();
	}
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
			this.targetList = r;
			if(r.length === 0) {
				this.getElementById('targets').text('-');
			} else {
				this.getElementById('targets').text(r.join(', '));
			}
		}.bind(this)).fail(function(r) {
			this.targetList = [];
			this.getElementById('targets').text('-');
		});
		event.method = 'getCharacters';
		this.fireEvent(event);
	}.bind(this));

	this.getElementById('toggleRegistedOrNot').click((e) => {
		let text = this.getElementById('memo').val();
		if(text.startsWith('素通し')) {
			this.getElementById('memo').val(text.replace('素通し', '抵抗'));
			this.getElementById('critical').val('@13');
		} else if(text.startsWith('抵抗')) {
			this.getElementById('memo').val(text.replace('抵抗', '素通し'));
			this.getElementById('critical').val('@10');
		} else {
			this.getElementById('memo').val(`抵抗 ${text}`);
			this.getElementById('critical').val('@13');
		}
		this.getElementById('critical').css('background-color', '#ff7f7f');
		setTimeout(()=>{
			this.getElementById('critical').css('background-color', 'white');
		}, 500);
	});

	this.getElementById('hitexec').click(function(e) {
		var magic = this.magics[list.val()];
		this.fireEvent({
			target: e.target,
			targetList: this.targetList,
			type: com.hiyoko.sweet.PlayerBattle.Events.role,
			message: `2d6${magic.exceeded ? '@10' : ''}+${magic.value}%s / 行使判定 ：${magic.name} ${this.getElementById('memo').val()}`,
			col: 7
		});
	}.bind(this));
	
	this.getElementById('damexec').click(function(e) {
		var magic = this.magics[list.val()];
		this.fireEvent({
			target: e.target,
			type: com.hiyoko.sweet.PlayerBattle.Events.role,
			isDamage: true,
			targetList: this.targetList,
			message: com.hiyoko.util.format('k%s+%s\\%s\\%s%s%s#\\%s / ダメージ ：%s %s',
					this.getElementById('rate').val(),
					magic.value,
					this.getElementById('critical').val(),
					this.getElementById('rolevalue').val(),
					magic.name, this.getElementById('memo').val()),
			col: [3, 7, 9]
		});
	}.bind(this));

	this.getElementById('memo-clear').click(function(e) {
		this.getElementById('memo').val('');
		this.getElementById('targets').text('-');
		this.getElementById('memo').focus();
		this.targetList = [];
	}.bind(this));
	
	this.getElementById('bard-musicElement-share').click(function(e) {
		const text = `現在の楽素\n` +
		`　　⤴ ${this.getElementById('bard-musicElement-upper').val()}\n` +
		`　　⤵ ${this.getElementById('bard-musicElement-downer').val()}\n` +
		`　　💛 ${this.getElementById('bard-musicElement-hearts').val()}`
		this.fireEvent({
			type: 'tofRoomRequest',
			args: [{
				message: text
			}],
			method: 'sendChat'
		});
	}.bind(this));
};

com.hiyoko.sweet.PlayerBattle.Magics.isExceeded = (name, skills) => {
	let level = 0;
	com.hiyoko.sweet.PlayerBattle.Magics.SkillTable[name].forEach((skillName)=>{
		if(level < (skills[skillName] || 0)) {
			level = skills[skillName];
		}
	});
	return level > 15;
};

com.hiyoko.sweet.PlayerBattle.Magics.SkillTable = {
	'真語魔法': ['ソーサラー'],
	'操霊魔法': ['コンジャラー'],
	'神聖魔法': ['プリースト'],
	'妖精魔法': ['フェアリーテイマー'],
	'魔動機術': ['マギテック'],
	'深智魔法': ['ソーサラー', 'コンジャラー'],
	'召異魔法': ['デーモンルーラー'],
	'秘奥魔法': ['グリモワール']
};
