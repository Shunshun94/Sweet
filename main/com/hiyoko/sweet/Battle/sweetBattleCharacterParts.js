var com = com || {};
com.hiyoko = com.hiyoko || {};
com.hiyoko.sweet = com.hiyoko.sweet || {};
com.hiyoko.sweet.Battle = com.hiyoko.sweet.Battle || {};

com.hiyoko.sweet.Battle.BattleCharacter = function($html, opt_params) {
	this.$html = $($html);
	this.id = this.$html.attr('id');
	this.clazz = this.$html.attr('class');
	this.parts = {};
	this.nameList = false;

	this.render();

	this.saveButton = this.getElement('.' + this.clazz + '-save');
	this.removeButton = this.getElement('.' + this.clazz + '-remove');

	this.vitalityRegistButton = this.getElement('.' + this.clazz + '-vitality-exec');
	this.mentalityRegistButton = this.getElement('.' + this.clazz + '-mentality-exec');
	this.vitalityRegistStaticButton = this.getElement('.' + this.clazz + '-vitality-static-exec');
	this.mentalityRegistStaticButton = this.getElement('.' + this.clazz + '-mentality-static-exec');
	this.addPartButton = this.getElement('.' + this.clazz + '-addPart');

	this.addToTof = this.getElement('.' + this.clazz + '-add-tof');
	this.addToTofAsUnknown = this.getElement('.' + this.clazz + '-add-tof-unknown');
	
	this.name = this.getElement('.' + this.clazz + '-name');
	this.vitality = this.getElement('.' + this.clazz + '-vitality-val');
	this.mentality = this.getElement('.' + this.clazz + '-mentality-val');

	if(opt_params && opt_params.autocomplete) {
		this.name.attr({'autocomplete': 'on', 'list': opt_params.autocomplete});
	}
	
	this.bindEvents();
};

com.hiyoko.util.extend(com.hiyoko.sweet.ApplicationBase, com.hiyoko.sweet.Battle.BattleCharacter);

com.hiyoko.sweet.Battle.BattleCharacter.prototype.render = function() {
	this.$html.append(com.hiyoko.util.format(
			'<button class="%s">SAVE</button><p>名前 <input value="NO NAME" type="text" class="%s" />' +
			'<button class="%s">コマ追加</button><button class="%s">コマ追加 (正体不明)</button></p>' + 
			'<div>生命抵抗力<input type="number" value="0" class="%s" />' +
			'<button class="%s">判定</button><button class="%s">判定(固定値)</button>' +
			' 　/　精神抵抗力<input type="number" value="0" class="%s" />' +
			'<button class="%s">判定</button><button class="%s">判定(固定値)</button></div>' +
			'<button class="%s">部位追加</button><button class="%s">REMOVE</button>',
			this.clazz + '-save', this.clazz + '-name',
			this.clazz + '-add-tof', this.clazz + '-add-tof-unknown',
			this.clazz + '-vitality-val', this.clazz + '-vitality-exec', this.clazz + '-vitality-static-exec',
			this.clazz + '-mentality-val', this.clazz + '-mentality-exec', this.clazz + '-mentality-static-exec',
			this.clazz + '-addPart', this.clazz + '-remove'));
	var id = this.addPart();
};

com.hiyoko.sweet.Battle.BattleCharacter.prototype.bindEvents = function() {
	this.saveButton.click(function(e){
		var result = this.getValue();
		this.fireEvent(new $.Event('saveRequest', {
			value: result
		}));
		this.saveButton.notify('保存しました', 'info');
	}.bind(this));

	this.addToTof.click(function(e) {
		var splitedId = this.id.split('-');
		this.fireEvent(new $.Event('appendCharacterRequest', {
			value: this.getValue(), hide: false, id: splitedId.pop()
		}));
	}.bind(this));
	
	this.addToTofAsUnknown.click(function(e) {
		var splitedId = this.id.split('-');
		this.name.val(com.hiyoko.util.rndString(3, 'UNKNOWN＃'));
		this.fireEvent(new $.Event('appendCharacterRequest', {
			value: this.getValue(), hide: true, id: splitedId.pop()
		}));
	}.bind(this));
	
	this.addPartButton.click(function(e){
		this.addPart();
	}.bind(this));
	
	this.removeButton.click(function(e){
		this.destract();
	}.bind(this));
	
	this.$html.on('removePart', function(e){
		this.destractPart(e.id);
	}.bind(this));
	
	this.vitalityRegistButton.click(function(e){
		this.fireEvent(new $.Event('executeRequestFromPart', {
			col: 5,
			text: '生命抵抗判定',
			value: '' + this.vitality.val() + '+2d6'
		}));
	}.bind(this));
	
	this.mentalityRegistButton.click(function(e){
		this.fireEvent(new $.Event('executeRequestFromPart', {
			col: 6,
			text: '精神抵抗判定',
			value: this.mentality.val() + '+2d6'
		}));
	}.bind(this));
	
	this.vitalityRegistStaticButton.click(function(e){
		this.fireEvent(new $.Event('executeRequestFromPart', {
			col: 5,
			text: '生命抵抗判定 (固定値)',
			value: 'C(' + this.vitality.val() + '+7'
		}));
	}.bind(this));
	
	this.mentalityRegistStaticButton.click(function(e){
		this.fireEvent(new $.Event('executeRequestFromPart', {
			col: 6,
			text: '精神抵抗判定 (固定値)',
			value: 'C(' + this.mentality.val() + '+7'
		}));
	}.bind(this));
	
	this.$html.on('executeRequestFromPart', function(e){
		var splitedId = this.id.split('-');
		this.fireEvent(new $.Event('executeRequest', {
			col: e.col,
			name: this.name.val(),
			text: e.text,
			value: e.value,
			id: splitedId.pop()
		}));
	}.bind(this));
	
	this.name.change(function(e) {
		var event = this.getAsyncEvent('loadRequest', {value:this.name.val()});
		event.done(function(result){
			this.setValue(result);
		}.bind(this)).fail(function(result){});
		this.fireEvent(event);
	}.bind(this));
};

com.hiyoko.sweet.Battle.BattleCharacter.prototype.setValue = function(result) {
	this.vitality.val(result.vitality);
	this.mentality.val(result.mentality);
	
	this.destractParts();
	
	result.parts.forEach(function(part){
		var id = this.addPart();
		this.parts[id].setValue(part);
	}.bind(this));
	
};

com.hiyoko.sweet.Battle.BattleCharacter.prototype.getValue = function() {
	var result = {
			name: this.name.val(),
			parts: [],
			vitality: Number(this.vitality.val()),
			mentality: Number(this.mentality.val())
	};
	
	if(! this.nameList) {
		this.nameList = new com.hiyoko.sweet.Battle.NameIndex();
		for(var key in this.parts) {
			if(this.parts[key]) {
				var tmp = this.parts[key].getValue();
				console.log(tmp);
				tmp.name = this.nameList.append(key, tmp.name);
				this.parts[key].setValue(tmp);
				console.log(tmp);
			}
		}
	}
	
	for(var key in this.parts) {
		if(this.parts[key]) {
			result.parts.push(this.parts[key].getValue());
		}
	}
	return result;
};

com.hiyoko.sweet.Battle.BattleCharacter.prototype.addPart = function(opt_original) {
	var newId = com.hiyoko.util.rndString(8);

	var $part = $(com.hiyoko.util.format('<div class="%s" id="%s"></tr>', this.clazz + '-part', this.id + '-' + newId));
	this.$html.append($part);
	this.parts[newId] = new com.hiyoko.sweet.Battle.BattleCharacter.Part(this.getElementById(newId));
	return newId;
};

com.hiyoko.sweet.Battle.BattleCharacter.prototype.destractParts = function() {
	for(var key in this.parts) {
		this.destractPart(key);
	}
}

com.hiyoko.sweet.Battle.BattleCharacter.prototype.destractPart = function(id) {
	this.parts[id].$html.remove();
	delete this.parts[id];
}

com.hiyoko.sweet.Battle.BattleCharacter.prototype.destract = function() {
	var splitedId = this.id.split('-');
	this.fireEvent(new $.Event('removeCharacter', {id: splitedId.pop()}));
};


com.hiyoko.sweet.Battle.BattleCharacter.Part = function($html, opt_original) {
	this.$html = $html;
	this.id = this.$html.attr('id');
	this.clazz = this.$html.attr('class');
	this.attackWays = {};

	this.render();
	this.add = this.getElement('.' + this.clazz + '-addAttackWay');
	this.remove = this.getElement('.' + this.clazz + '-delete');
	
	this.name = this.getElement('.' + this.clazz + '-name');
	this.dodge = this.getElement('.' + this.clazz + '-dodge');
	this.armor = this.getElement('.' + this.clazz + '-armor');
	this.hp = this.getElement('.' + this.clazz + '-hp');
	this.mp = this.getElement('.' + this.clazz + '-mp');
	
	this.dodgeExec = this.getElement('.' + this.clazz + '-dodge-exec');
	this.staticDodgeExec = this.getElement('.' + this.clazz + '-dodge-static-exec');
	
	this.bindEvents();
};

com.hiyoko.util.extend(com.hiyoko.sweet.ApplicationBase, com.hiyoko.sweet.Battle.BattleCharacter.Part);

com.hiyoko.sweet.Battle.BattleCharacter.Part.prototype.render = function() {
	var $table = $('<table border="1"></table>');
	var $status = $('<tr></tr>');

	$table.append('<tr><th>部位名</th><th>回避</th><th>防護</th><th>HP</th><th>MP</th></tr>');


	com.hiyoko.sweet.Battle.BattleCharacter.Part.COLUMN.forEach(function(v) {
		$status.append(com.hiyoko.util.format('<td class="%s"><input value="%s" class="%s" type="%s"></td>',
				this.clazz + '-' + v[1], v[1] === 'number' ? 0 : '',
				this.clazz + '-' + v[0], v[1]));
	}.bind(this));

	$table.append($status)
	this.$html.append(com.hiyoko.util.format('<button class="%s">REMOVE</button>' +
			'<button class="%s">攻撃手段追加</button>' + 
			'<button class="%s">回避</button><button class="%s">回避(固定値)</button>',
			this.clazz + '-delete', this.clazz + '-addAttackWay', this.clazz + '-dodge-exec', this.clazz + '-dodge-static-exec'));
	this.$html.append($table);

	this.addAttackWay({name: '通常攻撃'});
};

com.hiyoko.sweet.Battle.BattleCharacter.Part.prototype.bindEvents = function() {
	this.add.click(function(e){
		this.addAttackWay();
	}.bind(this));
	
	this.remove.click(function(e){
		this.destract();
	}.bind(this));
	
	this.dodgeExec.click(function(e){
		this.fireEvent(new $.Event('executeRequestFromPart', {
			col: 4,
			text: this.name.val() + '：回避判定:',
			value: this.dodge.val() + '+2d6'
		}));
	}.bind(this));
	
	this.staticDodgeExec.click(function(e){
		this.fireEvent(new $.Event('executeRequestFromPart', {
			col: 4,
			text: this.name.val() + '：回避判定 (固定値)',
			value: 'C(' + this.dodge.val() + '+7'
		}));
	}.bind(this));
	
	this.$html.on('executeRequestFromAttackWay', function(e){
		this.fireEvent(new $.Event('executeRequestFromPart', {
			col: e.col,
			text: this.name.val() + '：' + e.text,
			value: e.value
		}));
	}.bind(this));
	
	this.$html.on('removeAttackWay', function(e) {
		this.destractAttackWay(e.id);
	}.bind(this));
};

com.hiyoko.sweet.Battle.BattleCharacter.Part.prototype.addAttackWay = function(opt_param) {
	var newId = com.hiyoko.util.rndString(8);
	var $dom = $('<div></div>');

	$dom.addClass(this.clazz + '-attackway');
	$dom.attr('id', this.id + '-' + newId);
	this.$html.append($dom)

	this.attackWays[newId] = new com.hiyoko.sweet.Battle.BattleCharacter.Part.AttackWay(this.getElementById(newId), opt_param);
	return newId;
};

com.hiyoko.sweet.Battle.BattleCharacter.Part.prototype.setValue = function(value) {
	com.hiyoko.sweet.Battle.BattleCharacter.Part.COLUMN.forEach(function(column){
		this.getElement('.' + this.clazz + '-' + column[0]).val(value[column[0]]);
	}.bind(this));
	
	this.destractAttackWays();
	
	value.attackWays.forEach(function(aw) {
		var id = this.addAttackWay();
		this.attackWays[id].setValue(aw);
	}.bind(this));
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
		if(column[1] === 'number') {
			result[column[0]] = Number(this.getElement('.' + this.clazz + '-' + column[0]).val()) || 0;
		} else {
			result[column[0]] = this.getElement('.' + this.clazz + '-' + column[0]).val();
		}
	}.bind(this));

	return result;
};

com.hiyoko.sweet.Battle.BattleCharacter.Part.prototype.destract = function() {
	var splitedId = this.id.split('-');
	this.fireEvent(new $.Event('removePart', {id: splitedId.pop()}));
}

com.hiyoko.sweet.Battle.BattleCharacter.Part.prototype.destractAttackWays = function() {
	for(var key in this.attackWays) {
		this.destractAttackWay(key);
	}
}

com.hiyoko.sweet.Battle.BattleCharacter.Part.prototype.destractAttackWay = function(id) {
	this.attackWays[id].$html.remove();
	delete this.attackWays[id];
};

com.hiyoko.sweet.Battle.BattleCharacter.Part.COLUMN = [
                                                       ['name', 'text'],
                                                       ['dodge', 'number'],
                                                       ['armor', 'number'],
                                                       ['hp', 'number'],
                                                       ['mp', 'number']
                                                       ];

com.hiyoko.sweet.Battle.BattleCharacter.Part.AttackWay = function($html, opt_param) {
	this.$html = $html;
	this.id = this.$html.attr('id');
	this.clazz = this.$html.attr('class');
	this.render();

	this.name = this.getElement('.' + this.clazz + '-name');
	this.value = this.getElement('.' + this.clazz + '-val');
	this.atk = this.getElement('.' + this.clazz + '-atk');
	this.atkMode = this.getElement('.' + this.clazz + '-atk-mode');
	this.atkSwitch = this.getElement('.' + this.clazz + '-switch');
	this.atkExec = this.getElement('.' + this.clazz + '-atk-exec');
	this.exec = this.getElement('.' + this.clazz + '-exec');
	this.staticExec = this.getElement('.' + this.clazz + '-static-exec');
	this.del = this.getElement('.' + this.clazz + '-del');
	if(opt_param) {
		this.name.val(opt_param.name || '');
		this.value.val(opt_param.val || 0);
	}
	
	this.bindEvent();

}; 

com.hiyoko.util.extend(com.hiyoko.sweet.ApplicationBase, com.hiyoko.sweet.Battle.BattleCharacter.Part.AttackWay);

com.hiyoko.sweet.Battle.BattleCharacter.Part.AttackWay.prototype.bindEvent = function() {
	this.atkSwitch.click(function(e){
		var newValue = 1 - Number(this.atkMode.attr('title'));
		if(newValue === 1) {
			this.atkMode.text('ダメージ基準値');
		} else {
			this.atkMode.text('魔法威力レート');
		}
		this.atkMode.attr('title', newValue);
	}.bind(this));
	
	this.del.click(function(e) {
		this.destract();
	}.bind(this));
	
	this.exec.click(function(e){
		if (this.atkMode.attr('title') === '0') {
			this.fireEvent(new $.Event('executeRequestFromAttackWay', {
				col: 7,
				text: this.name.val() + ' 行使判定',
				value: this.value.val() + '+2d6'
			}));
		} else {
			this.fireEvent(new $.Event('executeRequestFromAttackWay', {
				col: 2,
				text: this.name.val() + ' 命中判定',
				value: this.value.val() + '+2d6'
			}));			
		}
	}.bind(this));
	
	this.staticExec.click(function(e){
		if (this.atkMode.attr('title') === '0') {
			this.fireEvent(new $.Event('executeRequestFromAttackWay', {
				col: 7,
				text: this.name.val() + ' 行使判定',
				value: 'C(' + this.value.val() + '+7'
			}));
		} else {
			this.fireEvent(new $.Event('executeRequestFromAttackWay', {
				col: 2,
				text: this.name.val() + ' 命中判定',
				value: 'C(' + this.value.val() + '+7'
			}));			
		}
	}.bind(this));
	
	this.atkExec.click(function(e){
		if (this.atkMode.attr('title') === '0') {
			this.fireEvent(new $.Event('executeRequestFromAttackWay', {
				col: 7,
				text: this.name.val() + ' ダメージ',
				value:  'k' + this.atk.val() + '+' + this.value.val()
			}));
			this.fireEvent(new $.Event('executeRequestFromAttackWay', {
				col: 7,
				text: this.name.val() + ' ダメージ (抵抗)',
				value:  'k' + this.atk.val() + '@13+' + this.value.val()
			}));
		} else {
			this.fireEvent(new $.Event('executeRequestFromAttackWay', {
				col: 3,
				text: this.name.val() + ' ダメージ',
				value:  '2d6+' + this.atk.val()
			}));
		}

	}.bind(this));
};

com.hiyoko.sweet.Battle.BattleCharacter.Part.AttackWay.prototype.render = function() {
	this.$html.append(com.hiyoko.util.format('<input type="text" class="%s" />' +
			' 基準値 <input type="number" class="%s" />' + 
			' <span title="1" class="%s">ダメージ基準値</span> <input value="0" type="number" class="%s" />',
			this.clazz + '-name', this.clazz + '-val',
			this.clazz + '-atk-mode', this.clazz + '-atk'));
	this.$html.append(com.hiyoko.util.format('<button class="%s">判定</button>' +
			'<button class="%s">判定(固定値)</button>' +
			'<button class="%s">ダメージ</button>' +
			'<button class="%s">威力切替</button><button class="%s">REMOVE</button>',
			this.clazz + '-exec', this.clazz + '-static-exec', this.clazz + '-atk-exec',
			this.clazz + '-switch', this.clazz + '-del'));
};

com.hiyoko.sweet.Battle.BattleCharacter.Part.AttackWay.prototype.setValue = function(value) {
	this.name.val(value.name);
	this.value.val(value.value);
	this.atk.val(value.damage);
	
	if(value.isMagic) {
		this.atkMode.attr('title', 0);
		this.atkMode.text('魔法威力レート');
	} else {
		this.atkMode.attr('title', 1);
		this.atkMode.text('ダメージ基準値');
	}
	
};

com.hiyoko.sweet.Battle.BattleCharacter.Part.AttackWay.prototype.getValue = function() {
	return {
		name: this.name.val(),
		value: Number(this.value.val()),
		isMagic: this.atkMode.attr('title') === '0',
		damage: this.atk.val()
	};
};

com.hiyoko.sweet.Battle.BattleCharacter.Part.AttackWay.prototype.destract = function() {
	var splitedId = this.id.split('-');
	this.fireEvent(new $.Event('removeAttackWay', {id:splitedId.pop()}));
};