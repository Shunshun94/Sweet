var com = com || {};
com.hiyoko = com.hiyoko || {};
com.hiyoko.sweet = com.hiyoko.sweet || {};

com.hiyoko.sweet.Battle = function($html, opt_params) {
	this.$html = $($html);
	this.LIST_NAME = 'SWEET Battle';
	this.id = this.$html.attr('id');
	this.list = {};
	this.nameList = new com.hiyoko.sweet.Battle.NameIndex();
	this.enemyList = {};
	
	this.optionalValues;
	
	this.datalist = this.getElementById('datalist');
	
	this.buildComponents();
	this.bindEvents();
};

com.hiyoko.util.extend(com.hiyoko.sweet.ApplicationBase, com.hiyoko.sweet.Battle);

com.hiyoko.sweet.Battle.prototype.buildComponents = function() {
	this.optionalValues = new com.hiyoko.sweet.Battle.OptionalValues(this.getElementById('optionalValues'));
	this.counterRemoCon = new com.hiyoko.sweet.Battle.CounterRemoCon(this.getElementById('counterRemoCon'));
	this.appendCharacter();
	
	this.getStorage('enemy-list', function(result){
		if (result) {
			this.enemyList = result;
			for(var name in this.enemyList) {
				this.datalist.append('<option>' + name + '</option>');
			}
		}
	}.bind(this));
};

com.hiyoko.sweet.Battle.prototype.bindEvents = function() {
	this.getElementById('appendCharacter').click(function(e){
		this.appendCharacter();
	}.bind(this));
	
	this.$html.on('executeRequest', function(e) {
		var option = this.optionalValues.getOptionalValue(e.col);
		var text = e.value.startsWith('C') ?
			com.hiyoko.util.format('%s%s) / %s', e.value, option.value, e.text) : 
			com.hiyoko.util.format('%s%s / %s', e.value, option.value, e.text);
		if(option.text) {
			text += ' (' + option.text + ')';
		}
		
		var event = this.getAsyncEvent('tofRoomRequest').done(function(r){
			$(e.target).notify('ダイスが振られました', {className: 'success', position: 'top'});
		}.bind(this)).fail(function(r){
			alert('ダイスを振るのに失敗しました\n' + r.result);
		});
		
		event.args = [{name: this.nameList.append(e.id, e.name), message: text, bot:'SwordWorld2.0'}];
		event.method = 'sendChat';
		this.fireEvent(event);
		$(e.target).notify('ダイスコマンドを送信しました' + text, {className: 'info', position: 'top'});
	}.bind(this));

	this.$html.on('appendCharacterRequest', function(e) {
		var event = this.getAsyncEvent('tofRoomRequest').done(function(r){
			$(e.target).notify('キャラクターが追加されました', {className: 'success', position: 'top'});
			e.resolve ? e.resolve() : false;
		}.bind(this)).fail(function(r){
			alert('キャラクターの追加に失敗しました\n' + r.result);
		});
		
		event.method = 'addCharacter';
		
		e.value.parts.forEach(function(p){
			if(e.hide) {
				event.args = [{
					name:this.nameList.append(e.id, e.value.name) + ':' + p.name
				}];
			} else {
				event.args = [{
					name:this.nameList.append(e.id, e.value.name) + ':' + p.name,
					HP: p.hp,
					MP: p.mp,
					'防護点': p.armor
				}];
			}
			
			this.fireEvent(event);
		}.bind(this));
		
		$(e.target).notify('キャラクター追加のリクエストを送信しました (' + e.value.name + ')', {className: 'info', position: 'top'});
	}.bind(this));
	
	this.$html.on('updateCharacterRequest', function(e) {
		var event = this.getAsyncEvent('tofRoomRequest').done(function(r){
			$(e.target).notify('情報を更新されました', {className: 'success', position: 'top'});
			e.resolve ? e.resolve(r) : false;
		}.bind(this)).fail(function(r){
			alert('情報の更新に失敗しました\n' + r.result);
			e.reject ? e.reject(r) : false;
		});
		
		event.method = 'updateCharacter';
		
		e.value.parts.forEach(function(p){
			if(e.hide) {
				event.args = [{
					targetName:this.nameList.append(e.id, e.value.name) + ':' + p.name
				}];
			} else {
				event.args = [{
					targetName:this.nameList.append(e.id, e.value.name) + ':' + p.name,
					HP: p.hp,
					MP: p.mp,
					'防護点': p.armor
				}];
			}
			
			this.fireEvent(event);
		}.bind(this));
		
		$(e.target).notify('情報更新のリクエストを送信しました (' + e.value.name + ')', {className: 'info', position: 'top'});
	}.bind(this));
	
	this.$html.on('saveRequest', function(e){
		this.enemyList[e.value.name] = e.value;
		this.setStorage('enemy-list', this.enemyList);
	}.bind(this));
	
	this.$html.on('loadRequest', function(e){
		if(this.enemyList[e.value]) {
			e.resolve(this.enemyList[e.value]);
		} else {
			e.reject();
		}
	}.bind(this));
	
	this.$html.on('removeCharacter', function(e){
		this.destractCharacter(e.id);
	}.bind(this));
	
	this.$html.on('renameByPartRemove', function(e){
		var event = this.getAsyncEvent('tofRoomRequest').done(function(r){
			e.resolve ? e.resolve(r) : false;
		}.bind(this)).fail(function(r){
			alert(e.name + 'の更新に失敗しました\n' + r.result);
			e.reject ? e.reject(r) : false;
		});
		
		event.method = 'updateCharacter';
		event.args = [{
			targetName:this.nameList.append(e.id) + ':' + e.name,
			name: '[×] ' + this.nameList.append(e.id) + ':' + e.name
		}];
			
		this.fireEvent(event);
	}.bind(this));
	
	this.$html.on('CounterRemoConInitializeRequest', function(e){
		var list = [];
		com.hiyoko.util.forEachMap(this.list, function(v, k){
			var data = v.getValue();
			if(data.parts.length === 1) {
				list.push({
					type: 'leaf',
					value: k,
					text: data.name
				});
			} else {
				var val = {
					type: 'namednode',
					value: k,
					text: data.name
				};
				
				val.list = data.parts.map(function(p, i){
					return {
						text: p.name,
						value: i,
						type: 'leaf'
					};
				});
				
				list.push(val);
			}
		});
		this.counterRemoCon.injectList(list);
	}.bind(this));
	
	this.$html.on('CounterRemoConChangeHP', function(e){
		console.log(e);
	});
};

com.hiyoko.sweet.Battle.prototype.appendCharacter = function() {
	var newId = com.hiyoko.util.rndString(8);
	
	this.$html.append(com.hiyoko.util.format('<div class="%s" id="%s"></div>',
			this.id + '-character',
			this.id + '-character-' + newId));
	this.list[newId] = new com.hiyoko.sweet.Battle.BattleCharacter(this.getElementById('character-' + newId),
			{autocomplete:this.datalist.attr('id')});
	return newId;
};

com.hiyoko.sweet.Battle.prototype.destractCharacter = function(id) {
	this.list[id].$html.remove();
	this.nameList.remove(id);
	delete this.list[id];
};

com.hiyoko.sweet.Battle.NameIndex = function() {
	this.enemyNameIdList = {};
	this.enemyIdNameList = {};
};

com.hiyoko.sweet.Battle.NameIndex.prototype.remove = function(id) {
	var name = this.enemyIdNameList[id];
	delete this.enemyNameIdList[name];
	delete this.enemyIdNameList[id];
	return name;
};

com.hiyoko.sweet.Battle.NameIndex.prototype.append = function(id, _name) {
	if(this.enemyIdNameList[id]) {
		if(_name && ! this.enemyIdNameList[id].startsWith(_name)) {
			this.remove(id);
			return this.append(id, _name);
		}
		return this.enemyIdNameList[id];
	}
	
	var name = String(_name);
	
	if(this.enemyNameIdList[name]) {
		var i = 1;
		name = String(_name) + '_' + i;
		while(this.enemyNameIdList[name]) {
			i++;
			name = String(_name) + '_' + i;
		}
		this.enemyNameIdList[name] = id;
		this.enemyIdNameList[id] = name;
	} else {
		this.enemyNameIdList[name] = id;
		this.enemyIdNameList[id] = name;
	}
	return name;
};


