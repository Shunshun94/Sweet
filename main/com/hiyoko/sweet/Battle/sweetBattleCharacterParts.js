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
	this.isTableExist = opt_params ? opt_params.isTableExist : false;
	this.added = false;
	this.isHide = false;
	this.optionValues = [];

	this.render();

	this.saveButton = this.getElement('.' + this.clazz + '-save');
	this.removeButton = this.getElement('.' + this.clazz + '-remove');

	this.vitalityRegistButton = this.getElement('.' + this.clazz + '-vitality-exec');
	this.mentalityRegistButton = this.getElement('.' + this.clazz + '-mentality-exec');
	this.vitalityRegistStaticButton = this.getElement('.' + this.clazz + '-vitality-static-exec');
	this.mentalityRegistStaticButton = this.getElement('.' + this.clazz + '-mentality-static-exec');
	this.addPartButton = this.getElement('.' + this.clazz + '-addPart');
	this.shareInfoButton = this.getElement(`.${this.clazz}-share-status`);
	this.toggleUnknown = this.getElement(`.${this.clazz}-hide-toggle`);
	this.toggleData = this.getElement(`.${this.clazz}-toggle`);
	this.callOption = this.getElement(`.${this.clazz}-options`);
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

com.hiyoko.util.extend(com.hiyoko.component.ApplicationBase, com.hiyoko.sweet.Battle.BattleCharacter);

com.hiyoko.sweet.Battle.BattleCharacter.prototype.render = function() {
	if(this.isTableExist) {
		this.$html.append(com.hiyoko.util.format(
				'<span class="%s">開閉</span><button class="%s">保存</button><p>名前 <input placeholder="NO NAME?" value="" type="text" class="%s" />' +
				'<button class="%s">コマ追加</button><button class="%s">コマ追加 (正体不明)</button>' +
				'<button class="%s">バフ・デバフ設定</button></p>' +
				'<div>生命抵抗力<input type="number" value="0" class="%s" />' +
				'<button class="%s">判定</button><button class="%s">判定(固定値)</button>' +
				' 　/　精神抵抗力<input type="number" value="0" class="%s" />' +
				'<button class="%s">判定</button><button class="%s">判定(固定値)</button></div>' +
				'<button class="%s">部位追加</button><span class="%s">キャラクターを削除する</span>',
				this.clazz + '-toggle', this.clazz + '-save', this.clazz + '-name',
				this.clazz + '-add-tof', this.clazz + '-add-tof-unknown',
				this.clazz + '-options',
				this.clazz + '-vitality-val', this.clazz + '-vitality-exec', this.clazz + '-vitality-static-exec',
				this.clazz + '-mentality-val', this.clazz + '-mentality-exec', this.clazz + '-mentality-static-exec',
				this.clazz + '-addPart', this.clazz + '-remove'));
	} else {
		this.$html.append(
				`<span class="${this.clazz + '-toggle'}">開閉</span><button class="${this.clazz + '-save'}">保存</button><p>名前 <input placeholder="NO NAME?" value="" type="text" class="${this.clazz + '-name'}" />
				<button class="${this.clazz + '-share-status'}">データをテキストで共有</button><button class="${this.clazz + '-hide-toggle'}">未知の敵として扱う</button>
				<button class="${this.clazz + '-options'}">バフ・デバフ設定</button></p>
				<div>生命抵抗力<input type="number" value="0" class="${this.clazz + '-vitality-val'}" />
				<button class="${this.clazz + '-vitality-exec'}">判定</button><button class="${this.clazz + '-vitality-static-exec'}">判定(固定値)</button>
				 　/　精神抵抗力<input type="number" value="0" class="${this.clazz + '-mentality-val'}" />
				<button class="${this.clazz + '-mentality-exec'}">判定</button><button class="${this.clazz + '-mentality-static-exec'}">判定(固定値)</button></div>
				<button class="${this.clazz + '-addPart'}">部位追加</button><span class="${this.clazz + '-remove'}">キャラクターを削除する</span>`);
	}

	var id = this.addPart();
};

com.hiyoko.sweet.Battle.BattleCharacter.prototype.addOption = function(index, names) {
	let list = [];
	for(var key in this.parts) {
		let partList = this.parts[key].optionValues;
		if(! partList.includes(index)) {
			partList.push(index);
		}
		list.push(partList);
	}
	this.setOptions(list, names);
};
com.hiyoko.sweet.Battle.BattleCharacter.prototype.removeOption = function(index, names) {
	let list = [];
	for(var key in this.parts) {
		list.push(this.parts[key].optionValues.filter((d)=>{
			return d !== index
		}));
	}
	this.setOptions(list, names);
};

com.hiyoko.sweet.Battle.BattleCharacter.prototype.getOptions = function() {
	let parts = [];
	for(var key in this.parts) {
		parts.push(this.parts[key].optionValues);
	}
	return {
		character: this.optionValues,
		parts: parts
	};
};

com.hiyoko.sweet.Battle.BattleCharacter.prototype.setOptions = function(rawPartsData, names) {
	let partsData = [];
	if(rawPartsData) {
		if(rawPartsData.length === 1) {
			for(var key in this.parts) {
				partsData.push(rawPartsData[0]);
			}
		} else {
			partsData = rawPartsData
		}
		
		var i = 0;
		for(var key in this.parts) {
			this.parts[key].setOptions(partsData[i], names);
			i++;
		}
		this.optionValues = partsData[0];
		partsData.forEach((list, i)=>{
			this.optionValues = this.optionValues.filter((d)=>{
				return list.includes(d);
			});
		});
	} else {
		for(var key in this.parts) {
			this.parts[key].setOptions([], names);
		}
		this.optionValues = [];
	}
};

com.hiyoko.sweet.Battle.BattleCharacter.prototype.afterAdd = function() {
	this.addToTofAsUnknown.hide();
	this.addToTof.hide();
	this.addPartButton.hide();
	this.added = true;
	for(var key in this.parts) {
		if(this.parts[key]) {
			this.parts[key].afterAdd();
		}
	}
};

com.hiyoko.sweet.Battle.BattleCharacter.prototype.bindEvents = function() {
	this.saveButton.click(function(e){
		if(this.name.val() === '') {
			this.name.notify('名前が空欄です', 'error');
			return;
		}
		var result = this.getValue();
		this.fireEvent(new $.Event('saveRequest', {
			value: result
		}));
		this.saveButton.notify('保存しました', 'info');
	}.bind(this));

	this.addToTof.click(function(e) {
		if(this.name.val() === '') {
			this.name.notify('名前が空欄です', 'error');
			return;
		}
		this.isHide = false;
		this.$html.removeClass(`${this.clazz}-unknown`);
		var splitedId = this.id.split('-');
		this.fireEvent(this.getAsyncEvent('appendCharacterRequest', {
			value: this.getValue(), hide: false, id: splitedId.pop()
		}).done(function(r){this.afterAdd();}.bind(this)));
	}.bind(this));
	
	this.addToTofAsUnknown.click(function(e) {
		var splitedId = this.id.split('-');
		this.isHide = true;
		this.$html.addClass(`${this.clazz}-unknown`);
		this.name.val(com.hiyoko.util.rndString(3, 'UNKNOWN＃'));
		this.fireEvent(this.getAsyncEvent('appendCharacterRequest', {
			value: this.getValue(), hide: true, id: splitedId.pop()
		}).done(function(r){this.afterAdd();}.bind(this)));
	}.bind(this));

	this.shareInfoButton.click((e)=>{
		this.fireEvent({
			type: 'sharingEnemyDataRequest',
			id: this.id.split('-').pop()
		});
	});
	this.toggleUnknown.click((e)=>{
		this.isHide = ! this.isHide;
		if(this.isHide) {
			this.toggleUnknown.text('既知の敵として扱う');
		} else {
			this.toggleUnknown.text('未知の敵として扱う');
		}
		this.$html.toggleClass(`${this.clazz}-unknown`);
	});
	this.callOption.click((e) => {
		this.fireEvent({
			type: 'callCharacterOption',
			id: this.id.split('-').pop(),
			callback: this.setOptions.bind(this)
		});
	});
	this.toggleData.click((e) => {
		this.getElement('div').toggle(500);
		this.getElement('button').toggle(500);
	});

	this.$html.change(function(e) {
		if(! this.added) {
			return;
		}

		var splitedId = this.id.split('-');
		if($(e.target).attr('class').endsWith('-name')) {
			if(this.name.val() === '') {
				this.name.notify('名前が空欄です。', 'error');
				this.name.val('仮の名前');
			}
			this.fireEvent(new $.Event('updateCharacterNameRequest', {
				value: this.getValue(), id: splitedId.pop()
			}));
		} else {
			this.fireEvent(new $.Event('updateCharacterRequest', {
				value: this.getValue(), hide: this.isHide, id: splitedId.pop()
			}));
		}

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
			value: '' + this.vitality.val() + '+2d6',
			options: this.optionValues
		}));
	}.bind(this));
	
	this.mentalityRegistButton.click(function(e){
		this.fireEvent(new $.Event('executeRequestFromPart', {
			col: 6,
			text: '精神抵抗判定',
			value: this.mentality.val() + '+2d6',
			options: this.optionValues
		}));
	}.bind(this));
	
	this.vitalityRegistStaticButton.click(function(e){
		this.fireEvent(new $.Event('executeRequestFromPart', {
			col: 5,
			text: '生命抵抗判定 (固定値)',
			value: 'C(' + this.vitality.val() + '+7',
			options: this.optionValues
		}));
	}.bind(this));
	
	this.mentalityRegistStaticButton.click(function(e){
		this.fireEvent(new $.Event('executeRequestFromPart', {
			col: 6,
			text: '精神抵抗判定 (固定値)',
			value: 'C(' + this.mentality.val() + '+7',
			options: this.optionValues
		}));
	}.bind(this));
	
	this.$html.on('executeRequestFromPart', function(e){
		var splitedId = this.id.split('-');
		this.fireEvent(new $.Event('executeRequest', {
			col: e.col,
			name: this.name.val(),
			text: e.text,
			value: e.value,
			id: splitedId.pop(),
			options: e.options
		}));
	}.bind(this));
	
	this.name.change(function(e) {
		if(this.added) {
			return;
		}
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
	this.name.val(result.name);
	
	this.destractParts();
	
	result.parts.forEach(function(part){
		var id = this.addPart();
		this.parts[id].setValue(part);
	}.bind(this));
	
	this.isHide = result.isHidden;
	if(this.isHide) {
		this.$html.addClass(`${this.clazz}-unknown`);
	} else {
		this.$html.removeClass(`${this.clazz}-unknown`);
	}
	
	this.added = result.isAdded;
};

com.hiyoko.sweet.Battle.BattleCharacter.prototype.getValue = function() {
	var result = {
			name: this.name.val(),
			parts: [],
			vitality: Number(this.vitality.val()),
			mentality: Number(this.mentality.val()),
			isAdded: this.added,
			isHidden: this.isHide
	};
	
	if(! this.nameList) {
		this.nameList = new com.hiyoko.sweet.Battle.NameIndex();
		for(var key in this.parts) {
			if(this.parts[key]) {
				var tmp = this.parts[key].getValue();
				tmp.name = this.nameList.append(key, tmp.name);
				this.parts[key].setValue(tmp);
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

com.hiyoko.sweet.Battle.BattleCharacter.prototype.applyDamage = function(damages, type, opt_isMp) {
	var query = opt_isMp ? '.' + this.clazz + '-part-mp' : '.' + this.clazz + '-part-hp';
	
	var $elems = this.getElement(query);
	var $armor = this.getElement('.' + this.clazz + '-part-armor');
	
	damages.forEach(function(damage) {
		var point = damage.damage;
		
		if(type === 'physical') {
			point -= Number($($armor[damage.part]).val());
			if(point < 0) {
				point = 0;
			}
		}
		
		$($elems[damage.part]).val(Number($($elems[damage.part]).val()) - point);
	});
	this.$html.change();
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
	if(this.added) {
		var splitedId = this.id.split('-');
		this.fireEvent(new $.Event('renameByPartRemove', {id:splitedId.pop(), name:this.parts[id].name.val()}));
	}
	this.parts[id].$html.remove();
	delete this.parts[id];
}

com.hiyoko.sweet.Battle.BattleCharacter.prototype.destract = function() {
	this.destractParts();
	var splitedId = this.id.split('-');
	this.fireEvent(new $.Event('removeCharacter', {id: splitedId.pop()}));
};


com.hiyoko.sweet.Battle.BattleCharacter.Part = function($html, opt_original) {
	this.$html = $html;
	this.id = this.$html.attr('id');
	this.clazz = this.$html.attr('class');
	this.attackWays = {};
	this.optionValues = [];

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

com.hiyoko.util.extend(com.hiyoko.component.ApplicationBase, com.hiyoko.sweet.Battle.BattleCharacter.Part);

com.hiyoko.sweet.Battle.BattleCharacter.Part.prototype.setOptions = function(optionsList, name) {
	this.optionValues = optionsList;
	const options = this.optionValues.map((num)=>{return name[num]}).join(',');
	 this.getElement(`.${this.clazz}-optionsName`).text(options);
}

com.hiyoko.sweet.Battle.BattleCharacter.Part.prototype.afterAdd = function() {
	this.name.attr('disabled', 'disabled');
};

com.hiyoko.sweet.Battle.BattleCharacter.Part.prototype.render = function() {
	var $table = $(com.hiyoko.util.format('<table class="%s" border="1"></table>', this.clazz + '-table'));
	var $status = $('<tr></tr>');

	$table.append('<tr><th>部位名</th><th>回避</th><th>防護</th><th>HP</th><th>MP</th></tr>');


	com.hiyoko.sweet.Battle.BattleCharacter.Part.COLUMN.forEach(function(v) {
		$status.append(com.hiyoko.util.format('<td class="%s"><input value="%s" class="%s" type="%s"></td>',
				this.clazz + '-' + v[1], v[1] === 'number' ? 0 : '',
				this.clazz + '-' + v[0], v[1]));
	}.bind(this));

	$table.append($status)
	this.$html.append(com.hiyoko.util.format('<span class="%s"></span>' +
			'<span class="%s">×</span>' +
			'<button class="%s">攻撃手段追加</button>' + 
			'<button class="%s io-github-shunshun94-util-UnDoubleClickable">回避</button>'+
			'<button class="%s io-github-shunshun94-util-UnDoubleClickable">回避(固定値)</button>',
			this.clazz + '-optionsName', 
			this.clazz + '-delete', this.clazz + '-addAttackWay',
			this.clazz + '-dodge-exec', this.clazz + '-dodge-static-exec'));
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
			value: this.dodge.val() + '+2d6',
			options: this.optionValues
		}));
	}.bind(this));
	
	this.staticDodgeExec.click(function(e){
		this.fireEvent(new $.Event('executeRequestFromPart', {
			col: 4,
			text: this.name.val() + '：回避判定 (固定値)',
			value: 'C(' + this.dodge.val() + '+7',
			options: this.optionValues
		}));
	}.bind(this));
	
	this.$html.on('executeRequestFromAttackWay', function(e){
		this.fireEvent(new $.Event('executeRequestFromPart', {
			col: e.col,
			text: this.name.val() + '：' + e.text,
			value: e.value,
			options: this.optionValues
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
	this.targets = [];
	this.render();

	this.name = this.getElement('.' + this.clazz + '-name');
	this.value = this.getElement('.' + this.clazz + '-val');
	this.atk = this.getElement('.' + this.clazz + '-atk');
	this.atkMode = this.getElement('.' + this.clazz + '-atk-mode');
	this.atkSwitch = this.getElement('.' + this.clazz + '-switch');
	this.atkExec = this.getElement('.' + this.clazz + '-atk-exec');
	this.atkExecHalf = this.getElement('.' + this.clazz + '-atk-exec-half');
	this.exec = this.getElement('.' + this.clazz + '-exec');
	this.staticExec = this.getElement('.' + this.clazz + '-static-exec');
	this.del = this.getElement('.' + this.clazz + '-del');
	this.targetSelect = this.getElement(`.${this.clazz}-targetSelect`);
	this.targetClear = this.getElement(`.${this.clazz}-targetClear`);
	this.targetList = this.getElement(`.${this.clazz}-targets`);
	if(opt_param) {
		this.name.val(opt_param.name || '');
		this.value.val(opt_param.val || 0);
	}
	this.bindEvent();
}; 

com.hiyoko.util.extend(com.hiyoko.component.ApplicationBase, com.hiyoko.sweet.Battle.BattleCharacter.Part.AttackWay);


com.hiyoko.sweet.Battle.BattleCharacter.Part.AttackWay.prototype.executeDanage = function(isDamageEach, isRegisted = false) {
	var list = [];
	if(isDamageEach && this.targets.length) {
		list = this.targets;
	} else {
		list.push(this.targets.join(', '));
	}
	list.forEach((target) => {
		const tag = target ? `> ${target}` : '';
		if (this.atkMode.attr('title') === '0') {
			const crit = isRegisted ? '@13' : this.getElement(`.${this.clazz}-critical-value`).val();
			this.fireEvent(new $.Event('executeRequestFromAttackWay', {
				col: 7,
				text: `${this.name.val()} ダメージ${isRegisted ? ' (抵抗)' : ''} ${tag}`,
				value:  `k${this.atk.val()}${crit}+${this.value.val()}`
			}));
		} else {
			this.fireEvent(new $.Event('executeRequestFromAttackWay', {
				col: 3,
				text: `${this.name.val()} ダメージ${isRegisted ? ' (抵抗)' : ''} ${tag}`,
				value:  '2d6+' + this.atk.val()
			}));
		}
	});
};

com.hiyoko.sweet.Battle.BattleCharacter.Part.AttackWay.prototype.setAtkMode = function(newValue) {
	if(newValue === 1) {
		this.atkMode.text('ダメージ基準値');
		this.getElement(`.${this.clazz}-critical`).hide();
	} else {
		this.atkMode.text('威力');
		this.getElement(`.${this.clazz}-critical`).show();
	}
	this.atkMode.attr('title', newValue);	
};

com.hiyoko.sweet.Battle.BattleCharacter.Part.AttackWay.prototype.bindEvent = function() {
	this.atkSwitch.click((e)=>{
		this.setAtkMode(1 - Number(this.atkMode.attr('title')));
	});
	
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
		this.fireEvent(new $.Event('isDamageEach', {
			resolve: (isDamageEach) => {
				this.executeDanage(isDamageEach);
			}
		}));
	}.bind(this));
	this.atkExecHalf.click(function(e){
		this.fireEvent(new $.Event('isDamageEach', {
			resolve: (isDamageEach) => {
				this.executeDanage(isDamageEach, true);
			}
		}));
	}.bind(this));

	this.targetSelect.click((e) => {
		this.fireEvent(new $.Event('callNameSelector', {
			resolve: (list) => {
				this.targetList.text(list.join(', '));
				this.targets = list;
			}, reject: () => {
				this.targets = [];
				this.targetList.text('-');
			}
		}));
	});
	this.targetClear.click((e) => {
		this.targets = [];
		this.targetList.text('-');
	});
};

com.hiyoko.sweet.Battle.BattleCharacter.Part.AttackWay.prototype.render = function() {
	this.$html.append(com.hiyoko.util.format('<input type="text" class="%s" />' +
			' 基準値 <input type="number" class="%s" />' + 
			' <span title="1" class="%s">ダメージ基準値</span> <input value="0" type="number" class="%s" />'+
			`<span style="display:none;" class="${this.clazz}-critical"> C値 <select class="${this.clazz}-critical-value">
			<option value="@13">13</option>
			<option value="@12">12</option>
			<option value="@11">11</option>
			<option selected value="@10">10</option>
			<option value="@9">9</option>
			<option value="@8">8</option>
			<option value="@7">7</option>
		</select></span>`,
			this.clazz + '-name', this.clazz + '-val',
			this.clazz + '-atk-mode', this.clazz + '-atk'));
	this.$html.append(com.hiyoko.util.format('<button class="%s io-github-shunshun94-util-UnDoubleClickable">判定</button>' +
			'<button class="%s io-github-shunshun94-util-UnDoubleClickable">判定(固定値)</button>' +
			'<button class="%s io-github-shunshun94-util-UnDoubleClickable">ダメージ</button>' +
			'<button class="%s io-github-shunshun94-util-UnDoubleClickable">ダメージ (抵抗)</button>' +
			'<button class="%s">威力切替</button><span class="%s">×</span>',
			this.clazz + '-exec', this.clazz + '-static-exec',
			this.clazz + '-atk-exec', this.clazz + '-atk-exec-half',
			this.clazz + '-switch', this.clazz + '-del'));
	this.$html.append(`<br/><span class="${this.clazz}-targetSelector">対象: <span class="${this.clazz}-targets">-</span>
			<button class="${this.clazz}-targetSelect">対象を選択する</button>
			<button class="${this.clazz}-targetClear">クリア</button></span>`);
};

com.hiyoko.sweet.Battle.BattleCharacter.Part.AttackWay.prototype.setValue = function(value) {
	this.name.val(value.name);
	this.value.val(value.value);
	this.atk.val(value.damage);

	this.setAtkMode(value.isMagic ? 0 : 1);
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