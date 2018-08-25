var com = com || {};
com.hiyoko = com.hiyoko || {};
com.hiyoko.sweet = com.hiyoko.sweet || {};
com.hiyoko.sweet.PlayerBattle = com.hiyoko.sweet.PlayerBattle || {};

com.hiyoko.sweet.PlayerBattle.Response = function($html, character) {
	this.$html = $html;
	this.id = this.$html.attr('id');
	
	this.responses = {
		dodge: character.dodge,
		physical: character.physical,
		mental: character.mental
	};

	this.isExceeded = {
		dodge: (character.skills[character.dodgeSkill] || 0) > 15,
		physical: character.level > 15,
		mental: character.level > 15
	};

	this.bindEvents();
};

com.hiyoko.util.extend(com.hiyoko.component.ApplicationBase, com.hiyoko.sweet.PlayerBattle.Response);

com.hiyoko.sweet.PlayerBattle.Response.prototype.bindEvents = function() {
	this.getElementById('dodge').click(function(e) {
		this.fireEvent({
			target: e.target,
			type: com.hiyoko.sweet.PlayerBattle.Events.role,
			message: `2d6${this.isExceeded.dodge ? '@' : ''}+${this.responses.dodge}%s / 回避判定 `,
			col: 4
		});
	}.bind(this));
	
	this.getElementById('physical').click(function(e) {
		this.fireEvent({
			target: e.target,
			type: com.hiyoko.sweet.PlayerBattle.Events.role,
			message: `2d6${this.isExceeded.physical ? '@' : ''}+${this.responses.physical}%s / 生命抵抗判定 `,
			col: 5
		});
	}.bind(this));
	
	this.getElementById('mental').click(function(e) {
		this.fireEvent({
			target: e.target,
			type: com.hiyoko.sweet.PlayerBattle.Events.role,
			message: `2d6${this.isExceeded.mental ? '@' : ''}+${this.responses.mental}%s / 精神抵抗判定 `,
			col: 6
		});
	}.bind(this));
};