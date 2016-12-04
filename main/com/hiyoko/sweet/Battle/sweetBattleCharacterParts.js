var com = com || {};
com.hiyoko = com.hiyoko || {};
com.hiyoko.sweet = com.hiyoko.sweet || {};
com.hiyoko.sweet.Battle = com.hiyoko.sweet.Battle || {};

com.hiyoko.sweet.Battle.BattleCharacter = function($html, opt_params) {
	this.$html = $($html);
	this.id = this.$html.attr('id');
	this.clazz = this.$html.attr('class');
	this.parts = {};
	
	this.render();
	this.saveButton = this.getElement('.' + this.clazz + '-save');
	this.name = this.getElement('.' + this.clazz + '-name');
	
	this.bindEvents();
};

com.hiyoko.util.extend(com.hiyoko.sweet.ApplicationBase, com.hiyoko.sweet.Battle.BattleCharacter);

com.hiyoko.sweet.Battle.BattleCharacter.prototype.render = function() {
	this.$html.append(com.hiyoko.util.format(
			'<p>名前 <input type="text" class="%s" />' +
			'<button class="%s">SAVE</button></p>', this.clazz + '-name', this.clazz + '-save'));
	var id = this.addPart();
};

com.hiyoko.sweet.Battle.BattleCharacter.prototype.bindEvents = function() {
	this.saveButton.click(function(e){
		var result = this.getValue();
		console.log(result);		
	}.bind(this));

};

com.hiyoko.sweet.Battle.BattleCharacter.prototype.getValue = function() {
	var result = {name: this.name.val(), parts: []};
	for(var key in this.parts) {
		if(this.parts[key]) {
			result.parts.push(this.parts[key].getValue());
		}
	}
	return result;
};

com.hiyoko.sweet.Battle.BattleCharacter.prototype.addPart = function($table, opt_original) {
	var newId = com.hiyoko.util.rndString(8);
	
	var $part = $(com.hiyoko.util.format('<div class="%s" id="%s"></tr>', this.clazz + '-part', this.id + '-' + newId));
	this.$html.append($part);
	this.parts[newId] = new com.hiyoko.sweet.Battle.BattleCharacter.Part(this.getElementById(newId));
	return newId;
};

com.hiyoko.sweet.Battle.BattleCharacter.prototype.destract = function() {
	this.$html.remove();
};


com.hiyoko.sweet.Battle.BattleCharacter.Part = function($html, opt_original) {
	this.$html = $html;
	this.id = this.$html.attr('id');
	this.clazz = this.$html.attr('class');
	this.attackWays = {};
	
	this.render();
	this.bindEvents();
};

com.hiyoko.util.extend(com.hiyoko.sweet.ApplicationBase, com.hiyoko.sweet.Battle.BattleCharacter.Part);

com.hiyoko.sweet.Battle.BattleCharacter.Part.prototype.render = function() {
	var $table = $('<table border="1"></table>');
	var $status = $('<tr></tr>');
	
	$table.append('<tr><th>部位名</th><th>回避</th><th>防護</th><th>HP</th><th>MP</th><th>生命抵抗</th><th>精神抵抗</th><th>コマンド</th></tr>');
	
	
	com.hiyoko.sweet.Battle.BattleCharacter.Part.COLUMN.forEach(function(v) {
		$status.append(com.hiyoko.util.format('<td class="%s"><input class="%s" type="%s"></td>',
				this.clazz + '-' + v[1], this.clazz + '-' + v[0], v[1]));
	}.bind(this));
	
	$status.append(com.hiyoko.util.format('<td rowspan="2"><button class="%s">COPY</button><button class="%s">REMOVE</button></td>',
											this.clazz + '-copy', this.clazz + '-delete'));
	$table.append($status)
	this.$html.append($table);
	
	this.addAttackWay({name: '通常攻撃'});
};

com.hiyoko.sweet.Battle.BattleCharacter.Part.prototype.addAttackWay = function(opt_param) {
	var newId = com.hiyoko.util.rndString(8);
	var $dom = $('<div></div>');
	
	$dom.addClass(this.clazz + '-attackway');
	$dom.attr('id', this.id + '-' + newId);
	this.$html.append($dom)
	
	this.attackWays[newId] = new com.hiyoko.sweet.Battle.BattleCharacter.Part.AttackWay(this.getElementById(newId), opt_param);
};

com.hiyoko.sweet.Battle.BattleCharacter.Part.prototype.getValue = function() {
	var result = {};
	
	result.attackWays = [];
	for(var key in this.attackWays) {
		if(this.attackWays[key]) {
			result.attackWays.push(this.attackWays[key].getValue());
		}
	}
	
	com.hiyoko.sweet.Battle.BattleCharacter.Part.COLUMN.forEach(function(column) {
		result[column[0]] = Number(this.getElement('.' + this.clazz + '-' + column[0]).val()) || 0;
	}.bind(this));
	
	return result;
};

com.hiyoko.sweet.Battle.BattleCharacter.Part.prototype.destract = function() {
	this.$html.remove();
};

com.hiyoko.sweet.Battle.BattleCharacter.Part.COLUMN = [
	['name', 'text'],
	['dodge', 'number'],
	['armor', 'number'],
	['hp', 'number'],
	['mp', 'number'],
	['vitality', 'number'],
	['mentality', 'number']
];

com.hiyoko.sweet.Battle.BattleCharacter.Part.AttackWay = function($html, opt_param) {
	this.$html = $html;
	this.id = this.$html.attr('id');
	this.clazz = this.$html.attr('class');
	this.render();
	
	this.name = this.getElement('.' + this.clazz + '-name');
	this.value = this.getElement('.' + this.clazz + '-val');
	this.exec = this.getElement('.' + this.clazz + '-exec');
	this.del = this.getElement('.' + this.clazz + '-del');
	if(opt_param) {
		console.log(this.name)
		this.name.val(opt_param.name || '');
		this.value.val(opt_param.val || 0);
	}
	
}; 

com.hiyoko.util.extend(com.hiyoko.sweet.ApplicationBase, com.hiyoko.sweet.Battle.BattleCharacter.Part.AttackWay);

com.hiyoko.sweet.Battle.BattleCharacter.Part.AttackWay.prototype.render = function() {
	this.$html.append(com.hiyoko.util.format('<input type="text" class="%s" /> 基準値 <input type="number" class="%s" />',
											this.clazz + '-name', this.clazz + '-val'));
	this.$html.append(com.hiyoko.util.format('<button class="%s">判定</button><button class="%s">REMOVE</button>',
			this.clazz + '-exec', this.clazz + '-del'));
};

com.hiyoko.sweet.Battle.BattleCharacter.Part.AttackWay.prototype.getValue = function() {
	return {
		name: this.name.val(),
		value: Number(this.value.val())
	};
};

