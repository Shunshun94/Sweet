var com = com || {};
com.hiyoko = com.hiyoko || {};
com.hiyoko.sweet = com.hiyoko.sweet || {};
com.hiyoko.sweet.Pet || com.hiyoko.sweet.Pet || {};

com.hiyoko.sweet.Pet.Character = function($html, data, partsCandidates) {
	this.$html = $html;
	this.id = this.$html.attr('id');
	this.clazz = this.$html.attr('class');
	
	this.data = data;
	this.partsCandidates = partsCandidates;
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
		this.$html.notify('どどんとふにすでにデータがあったので読み込みました', {className: 'success', position: 'top'});
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
		var part = this.addPartGenerateHtml();
		part.setValue(v);
		this.data.mentality = v.mentality;
		this.data.vitality = v.vitality;
	}.bind(this));
	this.getElementById('physical').show();
	this.getElementById('mental').show();
	this.getElementById('append').hide();
};

com.hiyoko.sweet.Pet.Character.prototype.getCharacters = function(callback) {
	var event = this.getAsyncEvent('tofRoomRequest').done(function(r) {
		callback(r.characters.filter(function(c) {return (c.name || '').startsWith(this.data.name)}.bind(this)));
	}.bind(this));
	event.method = 'getCharacters';
	this.fireEvent(event);
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
			this.$html.notify('更新しました', {className: 'success', position: 'top'});
		}.bind(this)).fail(function(r){
			alert('更新に失敗しました\n' + r.result);
		}));
	}
};

com.hiyoko.sweet.Pet.Character.prototype.bindEvents = function() {
	this.getElementById('appendParts').click(this.addPart.bind(this));
	this.getElementById('physical').click(this.physicalCheck.bind(this));
	this.getElementById('mental').click(this.mentalCheck.bind(this));
	this.getElementById('append').click(this.appendCharacterToTof.bind(this));
	this.$html.change(this.updateHpMp.bind(this));
	
	this.$html.on('executeRequestFromPart', this.rethrowEventFromParts.bind(this));
	this.$html.on('removePart', this.removePart.bind(this));
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
		this.$html.notify('コマを作成しました', {className: 'success', position: 'top'});
		com.hiyoko.util.forEachMap(this.parts, function(v){v.afterAdd();});
	}.bind(this)).fail(function(r){
		alert('コマの作成に失敗しました\n' + r.result);
	}));
};

com.hiyoko.sweet.Pet.Character.prototype.removePart = function(e) {
	this.parts[e.id].$html.remove();
	delete this.parts[e.id];
};

com.hiyoko.sweet.Pet.Character.prototype.addPartGenerateHtml = function() {
	var newId = com.hiyoko.util.rndString(8);
	var $part = $(com.hiyoko.util.format('<div class="%s" id="%s"></tr>', this.clazz + '-part', this.id + '-' + newId));
	this.$html.append($part);
	this.parts[newId] = new com.hiyoko.sweet.Battle.BattleCharacter.Part(this.getElementById(newId));
	return this.parts[newId];
};

com.hiyoko.sweet.Pet.Character.prototype.addPart = function() {
	
	var data = this.partsCandidates[this.partsList.getId()];
	
	for(var key in this.parts) {
		if(data.name === this.parts[key].getValue().name) {
			alert('既にある部位と同じ名前の部位は追加できません');
			return null;
		}
	}

	var part = this.addPartGenerateHtml();

	part.setValue(data);
	this.data.mentality = data.mentality;
	this.data.vitality = data.vitality;
	this.getElementById('physical').show();
	this.getElementById('mental').show();
	
	return newId;
}

com.hiyoko.sweet.Pet.Character.render = function(idNo) {
	var $base = $('<div></div>')
	var id = this.id + '-character-' + idNo;
	var clazz = this.id + '-character';
	
	$base.addClass(clazz);
	$base.attr('id', id);
	
	$base.append(com.hiyoko.util.format('<button class="%s" id="%s">コマ追加</button>', clazz + '-append', id + '-append'));
	$base.append(com.hiyoko.util.format('<p>名前： <span class="%s" id="%s"></span></p>', clazz + '-name', id + '-name'));
	
	$base.append(com.hiyoko.util.format('<select class="%s" id="%s"></select>', clazz + '-partsCandidates', id + '-partsCandidates'));
	$base.append(com.hiyoko.util.format('<button class="%s" id="%s">部位追加</button>', clazz + '-appendParts', id + '-appendParts'));
	$base.append('<br/>');
	
	$base.append(com.hiyoko.util.format('<button class="%s" id="%s">生命抵抗判定</button>', clazz + '-physical', id + '-physical'));
	$base.append(com.hiyoko.util.format('<button class="%s" id="%s">精神抵抗判定</button>', clazz + '-mental', id + '-mental'));
	
	
	return $base;
};