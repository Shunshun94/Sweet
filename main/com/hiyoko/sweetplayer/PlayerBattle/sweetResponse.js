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
	
	this.bindEvents();
};

com.hiyoko.util.extend(com.hiyoko.component.ApplicationBase, com.hiyoko.sweet.PlayerBattle.Response);

com.hiyoko.sweet.PlayerBattle.Response.prototype.bindEvents = function() {
	this.getElementById('dodge').click(function(e) {
		this.fireEvent({
			target: e.target,
			type: com.hiyoko.sweet.PlayerBattle.Events.event,
			message: com.hiyoko.util.format('2d6+%s\\%s / 回避判定 ', this.responses.dodge),
			col: 4
		});
	}.bind(this));
	
	this.getElementById('physical').click(function(e) {
		this.fireEvent({
			target: e.target,
			type: com.hiyoko.sweet.PlayerBattle.Events.event,
			message: com.hiyoko.util.format('2d6+%s\\%s / 生命抵抗判定 ', this.responses.physical),
			col: 5
		});
	}.bind(this));
	
	this.getElementById('mental').click(function(e) {
		this.fireEvent({
			target: e.target,
			type: com.hiyoko.sweet.PlayerBattle.Events.event,
			message: com.hiyoko.util.format('2d6+%s\\%s / 精神抵抗判定 ', this.responses.mental),
			col: 6
		});
	}.bind(this));
};