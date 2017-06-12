var com = com || {};
com.hiyoko = com.hiyoko || {};
com.hiyoko.sweet = com.hiyoko.sweet || {};
com.hiyoko.sweet.PlayerBattle = com.hiyoko.sweet.PlayerBattle || {};

com.hiyoko.sweet.PlayerBattle.Weapons = function($html, character) {
	this.$html = $html;
	this.id = this.$html.attr('id');
	this.weapons = character.weapons;
	this.forRider(character);
	this.buildComponents();
	this.bindEvents();
	this.getElementById('list').change();
};

com.hiyoko.util.extend(com.hiyoko.component.ApplicationBase, com.hiyoko.sweet.PlayerBattle.Weapons);

com.hiyoko.sweet.PlayerBattle.Weapons.prototype.forRider = function(character) {
	[{skill: 'ライダー', name: '車載武器 (ライダー技能)', note:'騎獣に搭載された武器', category: '車載武器'},
	 {skill: 'シューター', name: '車載武器 (シューター技能)', note:'騎獣に搭載された武器', category: '車載武器'},
	 {skill: 'エンハンサー', name: '練技による攻撃', note:'攻撃用の練技', category: '練技'}].filter(function(w){
		return character.skills[w.skill]; 
	 }).forEach(function(w){
		 this.weapons.push({
				name:w.name,rank:"B",hand:"-",note:w.note,category:w.category,rate:0,crit:10,
				damage:character.skills[w.skill] + character.status[2],
				hit:character.skills[w.skill] + character.status[0]});
	 }.bind(this));
};

com.hiyoko.sweet.PlayerBattle.Weapons.prototype.buildComponents = function() {
	if(this.weapons.length === 0) {
		this.disable();
		return;
	}
	
	var list = this.getElementById('list');
	this.weapons.forEach(function(v, i) {
		list.append(com.hiyoko.util.format('<option value="%s">%s (%s %s)</option>',i, v.name, v.hand, v.category));
	});
};

com.hiyoko.sweet.PlayerBattle.Weapons.prototype.toggleRate = function(isEnabled) {
	if (isEnabled) {
		this.getElementById('rate').show();
		this.getElementById('ratelabel').show();			
	} else {
		this.getElementById('rate').hide();
		this.getElementById('ratelabel').hide();
	}
};

com.hiyoko.sweet.PlayerBattle.Weapons.prototype.toggleDamage = function(isEnabled) {
	if (isEnabled) {
		this.getElementById('damage').show();
		this.getElementById('damagelabel').show();			
	} else {
		this.getElementById('damage').hide();
		this.getElementById('damagelabel').hide();
	}
};

com.hiyoko.sweet.PlayerBattle.Weapons.prototype.bindEvents = function() {
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

	list.change(function(e) {
		var weapon = this.weapons[list.val()];
		this.getElementById('detail').text(com.hiyoko.util.format(
				'%s/%s/%sランク 命中:%s C値:%s 追加ダメージ:%s 威力:%s …… %s',
				weapon.hand, weapon.category, weapon.rank,
				weapon.hit, weapon.crit,
				('車載武器' === weapon.category) ? '攻撃手段による' : weapon.damage,
				(['ガン', '車載武器', '練技'].includes(weapon.category)) ? '攻撃手段による' : weapon.rate, weapon.note || '-'));
		if(weapon.category === '車載武器') {
			this.toggleRate(true);
			this.toggleDamage(true);
		}else if (['ガン', '練技'].includes(weapon.category)) {
			this.toggleRate(true);
			this.toggleDamage(false);
		} else {
			this.toggleRate(false);
			this.toggleDamage(false);
		}
	}.bind(this));
	
	this.getElementById('hitexec').click(function(e) {
		var weapon = this.weapons[list.val()];
		this.fireEvent({
			target: e.target,
			type: com.hiyoko.sweet.PlayerBattle.Events.role, 
			message: com.hiyoko.util.format('2d6+%s\\%s / 命中判定 ：%s %s', weapon.hit, weapon.name, this.getElementById('memo').val()),
			col: 2
		});
	}.bind(this));
	
	this.getElementById('damexec').click(function(e) {
		var weapon = this.weapons[list.val()];
		this.fireEvent({
			target: e.target,
			type: com.hiyoko.sweet.PlayerBattle.Events.role,
			message: com.hiyoko.util.format('k%s+%s\\%s%s%s / ダメージ ：%s %s',
					(['ガン', '車載武器', '練技'].includes(weapon.category)) ? this.getElementById('rate').val() : weapon.rate,
					('車載武器' === weapon.category) ? this.getElementById('damage').val() : weapon.damage,
					(this.getElementById('critical').val() || '@' + weapon.crit),
					this.getElementById('rolevalue').val(),
					weapon.name, this.getElementById('memo').val()),
			col: 3
		});
	}.bind(this));

	this.getElementById('memo-clear').click(function(e) {
		this.getElementById('memo').val('');
		this.getElementById('memo').focus();
	}.bind(this));
};
