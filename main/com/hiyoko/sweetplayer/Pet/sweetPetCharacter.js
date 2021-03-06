var com = com || {};
com.hiyoko = com.hiyoko || {};
com.hiyoko.sweet = com.hiyoko.sweet || {};
com.hiyoko.sweet.Pet || com.hiyoko.sweet.Pet || {};

com.hiyoko.sweet.Pet.Character = function($html, data, partsCandidates, hasTable) {
	this.$html = $html;
	this.id = this.$html.attr('id');
	this.clazz = this.$html.attr('class');

	this.data = data;
	this.partsCandidates = partsCandidates;
	this.hasTable = hasTable;
	this.parts = {};
	
	this.getCharacters(this.initialize.bind(this));
};

com.hiyoko.util.extend(com.hiyoko.component.ApplicationBase, com.hiyoko.sweet.Pet.Character);

com.hiyoko.sweet.Pet.Character.prototype.getName = function() {
	return this.getElementById('name').text();
};

com.hiyoko.sweet.Pet.Character.prototype.initialize = function(list) {
	this.buildComponents();
	this.bindEvents();
	if(list.length) {
		this.buildPartsList(list);
		alertify.success('どどんとふにすでにデータがあったので読み込みました');
	}
};

com.hiyoko.sweet.Pet.Character.prototype.tofCharacterToPetParts = function(tofData) {
	var name = (tofData.name || '').split(':')[1];
	var datas = this.partsCandidates.filter(function(v){return v.name === name});
	if(datas.length) {
		var data = datas[0];
		data.hp = tofData.counters.HP;
		data.mp = tofData.counters.MP;
		return data;
	} else {
		return {name: name, attackWays:[]};
	}
};

com.hiyoko.sweet.Pet.Character.prototype.buildPartsList = function(list) {
	list.map(this.tofCharacterToPetParts.bind(this)).forEach(function(v){
		var id = this.addPartGenerateHtml();
		this.parts[id].setValue(v);
		this.data.mentality = v.mentality;
		this.data.vitality = v.vitality;
	}.bind(this));
	this.getElementById('physical').show();
	this.getElementById('mental').show();
	this.getElementById('append').hide();
};

com.hiyoko.sweet.Pet.Character.prototype.getCharacters = function(callback) {
	if(this.hasTable) {
		var event = this.getAsyncEvent('tofRoomRequest').done(function(r) {
			callback(r.characters.filter(function(c) {return (c.name || '').startsWith(this.data.name)}.bind(this)));
		}.bind(this));
		event.method = 'getCharacters';
		this.fireEvent(event);
	} else {
		callback([]);
	}
};

com.hiyoko.sweet.Pet.Character.prototype.buildComponents = function() {
	this.getElementById('name').text(this.data.name);
	this.partsList = new com.hiyoko.sweet.Pet.PartsList(this.getElementById('partsCandidates'), this.partsCandidates);
};

com.hiyoko.sweet.Pet.Character.prototype.rethrowEventFromParts = function(e) {
	e.type = 'executeRequest';
	e.name = this.getElementById('name').text();
	this.fireEvent(e);
};

com.hiyoko.sweet.Pet.Character.prototype.physicalCheck = function(e) {
	this.fireEvent(new $.Event('executeRequest', {
		col: 5, text: '生命抵抗判定', name: this.getElementById('name').text(),
		value: '' + this.data.vitality + '+2d6'
	}));
};

com.hiyoko.sweet.Pet.Character.prototype.mentalCheck = function(e) {
	this.fireEvent(new $.Event('executeRequest', {
		col: 6, text: '精神抵抗判定', name: this.getElementById('name').text(),
		value: '' + this.data.mentality + '+2d6'
	}));
};

com.hiyoko.sweet.Pet.Character.prototype.updateHpMp = function(e) {
	var $tag = $(e.target);
	var clazz = $tag.attr('class');
	if(clazz.endsWith('part-hp') || clazz.endsWith('part-mp')) {
		var parts = [];
		com.hiyoko.util.forEachMap(this.parts, function(v){
			parts.push(v.getValue());
		});
		this.fireEvent(this.getAsyncEvent('executeUpdateCharacters', {
			name: this.getElementById('name').text(),
			parts: parts
		}).done(function(result){
			alertify.success('更新しました');
		}.bind(this)).fail(function(r){
			alertify.error('更新に失敗しました\n' + r.result);
		}));
	}
};

com.hiyoko.sweet.Pet.Character.prototype.bindEvents = function() {
	this.getElementById('appendParts').click(this.addPart.bind(this));
	this.getElementById('physical').click(this.physicalCheck.bind(this));
	this.getElementById('mental').click(this.mentalCheck.bind(this));
	this.getElementById('shareData').click(this.shareData.bind(this));
	if(this.hasTable) {
		this.getElementById('append').click(this.appendCharacterToTof.bind(this));
		this.$html.change(this.updateHpMp.bind(this));		
	}
	this.$html.on('shareData', this.shareData.bind(this));
	this.$html.on('executeRequestFromPart', this.rethrowEventFromParts.bind(this));
	this.$html.on('removePart', this.removePart.bind(this));
};

com.hiyoko.sweet.Pet.Character.prototype.shareData = function(e) {
	var parts = [];
	com.hiyoko.util.forEachMap(this.parts, function(v){
		parts.push(v.getValue());
	});
	let text = `\n **${this.data.name}** \n`;
	if(parts.length === 1) {
		text += `　HP:${parts[0].hp}　MP:${parts[0].mp}`;
	} else {
		text += parts.map((p)=>{return `　${p.name}　HP:${p.hp}　MP:${p.mp}`}).join('\n')
	}
	var event = {type: 'tofRoomRequest', resolve:function(){}, reject:function(){}};
	event.args = [{name: this.data.name, message: text}];
	event.method = 'sendChat';
	
	this.fireEvent(event);
};

com.hiyoko.sweet.Pet.Character.prototype.appendCharacterToTof = function(e) {
	var parts = [];
	com.hiyoko.util.forEachMap(this.parts, function(v){
		parts.push(v.getValue());
	});
	this.fireEvent(this.getAsyncEvent('executeAddCharacters', {
		name: this.getElementById('name').text(),
		parts: parts
	}).done(function(result){
		$(e.target).hide();
		alertify.success('コマを作成しました');
		com.hiyoko.util.forEachMap(this.parts, function(v){v.afterAdd();});
	}.bind(this)).fail(function(r){
		alertify.error('コマの作成に失敗しました\n' + r.result);
	}));
};

com.hiyoko.sweet.Pet.Character.prototype.removePart = function(e) {
	this.parts[e.id].$html.remove();
	delete this.parts[e.id];
};

com.hiyoko.sweet.Pet.Character.prototype.addPartGenerateHtml = function() {
	var newId = com.hiyoko.util.rndString(8);
	var $part = $(com.hiyoko.util.format('<div class="%s" id="%s"></div>', this.clazz + '-part', this.id + '-' + newId));
	this.$html.append($part);
	this.parts[newId] = new com.hiyoko.sweet.Battle.BattleCharacter.Part(this.getElementById(newId));
	return newId;
};

com.hiyoko.sweet.Pet.Character.prototype.addPart = function() {
	
	var data = this.partsCandidates[this.partsList.getId()];
	
	for(var key in this.parts) {
		if(data.name === this.parts[key].getValue().name) {
			alertify.error('既にある部位と同じ名前の部位は追加できません');
			return null;
		}
	}

	var newId = this.addPartGenerateHtml();
	this.parts[newId].setValue(data);
	this.data.mentality = data.mentality;
	this.data.vitality = data.vitality;
	this.getElementById('physical').show();
	this.getElementById('mental').show();
	
	return newId;
}

com.hiyoko.sweet.Pet.Character.render = function(idNo, isTableExist) {
	var $base = $('<div></div>')
	var id = this.id + '-character-' + idNo;
	var clazz = this.id + '-character';
	
	$base.addClass(clazz);
	$base.attr('id', id);
	if(isTableExist) {
		$base.append(com.hiyoko.util.format('<button class="%s io-github-shunshun94-util-UnDoubleClickable" id="%s">コマ追加</button>', clazz + '-append', id + '-append'));
	}
	$base.append(com.hiyoko.util.format('<button class="%s io-github-shunshun94-util-UnDoubleClickable" id="%s">チャットで状態を共有</button>', clazz + '-shareData', id + '-shareData'));
	$base.append(com.hiyoko.util.format('<p>名前： <span class="%s" id="%s"></span></p>', clazz + '-name', id + '-name'));
	
	$base.append(com.hiyoko.util.format('<select class="%s" id="%s"></select>', clazz + '-partsCandidates', id + '-partsCandidates'));
	$base.append(com.hiyoko.util.format('<button class="%s io-github-shunshun94-util-UnDoubleClickable" id="%s">部位追加</button>', clazz + '-appendParts', id + '-appendParts'));
	$base.append('<br/>');
	
	$base.append(com.hiyoko.util.format('<button class="%s io-github-shunshun94-util-UnDoubleClickable" id="%s">生命抵抗判定</button>', clazz + '-physical', id + '-physical'));
	$base.append(com.hiyoko.util.format('<button class="%s io-github-shunshun94-util-UnDoubleClickable" id="%s">精神抵抗判定</button>', clazz + '-mental', id + '-mental'));
	
	
	return $base;
};