var com = com || {};
com.hiyoko = com.hiyoko || {};
com.hiyoko.sweet = com.hiyoko.sweet || {};
com.hiyoko.sweet.PlayerBattle = com.hiyoko.sweet.PlayerBattle || {};

com.hiyoko.sweet.PlayerBattle.Weapons = function($html, character) {
	this.$html = $html;
	this.id = this.$html.attr('id');
	this.weapons = character.weapons; 
	console.log(this.weapons);
	this.buildComponents();
	this.bindEvents();
	this.getElementById('list').change();
};

com.hiyoko.util.extend(com.hiyoko.component.ApplicationBase, com.hiyoko.sweet.PlayerBattle.Weapons);

com.hiyoko.sweet.PlayerBattle.Weapons.prototype.buildComponents = function() {
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
	}.bind(this));
};
