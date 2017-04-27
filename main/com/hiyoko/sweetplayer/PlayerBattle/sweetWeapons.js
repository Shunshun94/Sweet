var com = com || {};
com.hiyoko = com.hiyoko || {};
com.hiyoko.sweet = com.hiyoko.sweet || {};
com.hiyoko.sweet.PlayerBattle = com.hiyoko.sweet.PlayerBattle || {};

com.hiyoko.sweet.PlayerBattle.Weapons = function($html, character) {
	this.$html = $html;
	this.id = this.$html.attr('id');
	this.weapons = character.weapons; 
	this.buildComponents();
	this.bindEvents();
	this.getElementById('list').change();
};

com.hiyoko.util.extend(com.hiyoko.component.ApplicationBase, com.hiyoko.sweet.PlayerBattle.Weapons);

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

com.hiyoko.sweet.PlayerBattle.Weapons.prototype.bindEvents = function() {
	var list = this.getElementById('list');
	list.change(function(e) {
		var weapon = this.weapons[list.val()];
		this.getElementById('detail').text(com.hiyoko.util.format(
				'%s/%s/%sランク 命中:%s C値:%s 追加ダメージ:%s 威力:%s …… %s',
				weapon.hand, weapon.category, weapon.rank,
				weapon.hit, weapon.crit, weapon.damage,
				(weapon.category === 'ガン') ? '弾丸による' : weapon.rate, weapon.note || '-'));
		if (weapon.category !== 'ガン') {
			this.getElementById('rate').hide();
			this.getElementById('ratelabel').hide();
		} else {
			this.getElementById('rate').show();
			this.getElementById('ratelabel').show();
		}
	}.bind(this));
	
	this.getElementById('hitexec').click(function(e) {
		var weapon = this.weapons[list.val()];
		this.fireEvent({
			target: e.target,
			type: com.hiyoko.sweet.PlayerBattle.Events.event,
			message: com.hiyoko.util.format('2d6+%s\\%s / 命中判定 ：%s %s', weapon.hit, weapon.name, this.getElementById('memo').val()),
			col: 2
		});
	}.bind(this));
	
	this.getElementById('damexec').click(function(e) {
		var weapon = this.weapons[list.val()];
		this.fireEvent({
			target: e.target,
			type: com.hiyoko.sweet.PlayerBattle.Events.event,
			message: com.hiyoko.util.format('k%s+%s\\%s%s%s / ダメージ ：%s %s',
					(weapon.category === 'ガン') ? this.getElementById('rate').val() :weapon.rate,
					weapon.damage,
					(this.getElementById('critical').val() || '@' + weapon.crit),
					this.getElementById('rolevalue').val(),
					weapon.name, this.getElementById('memo').val()),
			col: 3
		});
	}.bind(this));
};
