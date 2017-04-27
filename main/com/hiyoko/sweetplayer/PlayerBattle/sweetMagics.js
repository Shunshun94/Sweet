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
	this.buildComponents();
	this.bindEvents();
};

com.hiyoko.util.extend(com.hiyoko.component.ApplicationBase, com.hiyoko.sweet.PlayerBattle.Magics);

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
	
	this.getElementById('hitexec').click(function(e) {
		var magic = this.magics[list.val()];
		this.fireEvent({
			target: e.target,
			type: com.hiyoko.sweet.PlayerBattle.Events.event,
			message: com.hiyoko.util.format('2d6+%s\\%s / 行使判定 ：%s %s', magic.value, magic.name, this.getElementById('memo').val()),
			col: 6
		});
	}.bind(this));
	
	this.getElementById('damexec').click(function(e) {
		var magic = this.magics[list.val()];
		this.fireEvent({
			target: e.target,
			type: com.hiyoko.sweet.PlayerBattle.Events.event,
			message: com.hiyoko.util.format('k%s+%s\\%s%s%s / ダメージ ：%s %s',
					this.getElementById('rate').val(),
					magic.value,
					this.getElementById('critical').val(),
					this.getElementById('rolevalue').val(),
					magic.name, this.getElementById('memo').val()),
			col: 3
		});
	}.bind(this));
};
