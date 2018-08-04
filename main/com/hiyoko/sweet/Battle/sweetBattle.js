var com = com || {};
com.hiyoko = com.hiyoko || {};
com.hiyoko.sweet = com.hiyoko.sweet || {};

com.hiyoko.sweet.Battle = function($html, opt_params) {
	this.$html = $($html);
	this.LIST_NAME = 'SWEET Battle - 戦闘';
	this.id = this.$html.attr('id');
	this.list = {};
	
	this.nameList = new com.hiyoko.sweet.Battle.NameIndex();
	this.tofLoader = new com.hiyoko.sweet.Battle.TofLoader(this.$html);
	
	this.enemyList = {};
	
	this.$characters = this.getElementById('characters');
	
	this.optionalValues;
	
	this.datalist = this.getElementById('datalist');
	
	this.bindEvents();
	this.buildComponents();
};

com.hiyoko.util.extend(com.hiyoko.component.ApplicationBase, com.hiyoko.sweet.Battle);

com.hiyoko.sweet.Battle.prototype.buildComponents = function() {
	this.buildEnemyList();
	this.optionalValues = new com.hiyoko.sweet.Battle.OptionalValues(this.getElementById('optionalValues'));
	this.counterRemoCon = new com.hiyoko.sweet.Battle.CounterRemoCon(this.getElementById('counterRemoCon'));
	this.storagedList = new com.hiyoko.sweet.Battle.CharacterLister(this.getElementById('strogaedList'));
	this.nameSelector = new com.hiyoko.sweet.PlayerBattle.NameSelector(this.getElementById('nameSelector'))
	this.appendCharacter();
};

com.hiyoko.sweet.Battle.prototype.buildEnemyList = function() {
	this.getStorage('enemy-list', function(result){
		if (result) {
			this.datalist.empty();
			this.enemyList = result;
			for(var name in this.enemyList) {
				this.datalist.append('<option>' + name + '</option>');
			}
		}
	}.bind(this));
};

com.hiyoko.sweet.Battle.prototype.roleDice = function(e) {
	var option = this.optionalValues.getOptionalValue(e.col);
	var event = this.getAsyncEvent('tofRoomRequest').done(function(r){
		$(e.target).notify('ダイスが振られました', {className: 'success', position: 'top'});
	}.bind(this)).fail(function(r){
		alert('ダイスを振るのに失敗しました\n' + r.result);
	});
	var text = e.value.startsWith('C') ?
			com.hiyoko.util.format('%s%s) / %s', e.value, option.value, e.text) : 
			com.hiyoko.util.format('%s%s / %s', e.value, option.value, e.text);
	if(option.text) {
		text += ' (' + option.text + ')' + option.detail;
	}
	
	event.args = [{name: this.nameList.append(e.id, e.name), message: text, bot:'SwordWorld2.0'}];
	event.method = 'sendChat';
	this.fireEvent(event);
	$(e.target).notify('ダイスコマンドを送信しました' + text, {className: 'info', position: 'top'});
};

com.hiyoko.sweet.Battle.prototype.putCharacter = function(e) {
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
				name:this.nameList.append(e.id, e.value.name) + ':' + p.name,
				info:com.hiyoko.sweet.Battle.TofLoader.SIGNATURE
			}];
		} else {
			event.args = [{
				name:this.nameList.append(e.id, e.value.name) + ':' + p.name,
				HP: p.hp,
				MP: p.mp,
				'防護点': p.armor,
				info:com.hiyoko.sweet.Battle.TofLoader.SIGNATURE
			}];
		}
		
		this.fireEvent(event);
	}.bind(this));
	
	$(e.target).notify('キャラクター追加のリクエストを送信しました (' + e.value.name + ')', {className: 'info', position: 'top'});
};

com.hiyoko.sweet.Battle.prototype.appendCharacterFromCharacterList = function(e) {
	var id = this.appendCharacter();
	this.list[id].setValue(this.enemyList[e.name]);
};

com.hiyoko.sweet.Battle.prototype.deleteCharacterFromCharacterList = function(e) {
	delete this.enemyList[e.name];
	this.setStorage('enemy-list', this.enemyList);
	this.buildEnemyList();
};

com.hiyoko.sweet.Battle.prototype.openNameSelector = function(e) {
	this.fireEvent(this.getAsyncEvent('tofRoomRequest', {method: 'getCharacters'}).done((result) => {
		this.nameSelector.open(
				result.characters.filter(function(character){
					return (character.type === 'characterData');
				}).map(function(character) {
					return character.name;
				}), e.resolve, e.reject);
	}).fail((e)=> {
		alert(`キャラクター一覧の取得に失敗しました\n理由: ${e.result}`)
		console.error(e);
	}));
};

com.hiyoko.sweet.Battle.prototype.bindEvents = function() {
	this.getElementById('jump-top').click(function(e) {
		$('html,body').animate({scrollTop: '0px'},'slow');
	});
	
	this.getElementById('appendCharacter').click(function(e){
		this.appendCharacter();
	}.bind(this));
	this.getElementById('appendCharacter-bottom').click(function(e){
		this.appendCharacter();
	}.bind(this));
	this.getElementById('appendCharacter-ytSheetM').click(function(e){
		var url = window.prompt('読み込むゆとシートMのURLを入力してください');
		if(url) {
			var event = this.getAsyncEvent('algorithmiaRequest').done(function(r){
				var id = this.appendCharacter();
				this.list[id].setValue(r);
				$(e.target).notify('読み込みました', {className: 'success', position: 'top'});
			}.bind(this)).fail(function(r){
				console.log(r);
				alert('読み込みに失敗しました\n' + r.message);
			});
			event.algorithm = 'algo://Shunshun94/ytSheetMParser/0.4.2';
			event.params = url;
			this.fireEvent(event);
		}
	}.bind(this));

	this.$html.on('callNameSelector', this.openNameSelector.bind(this));

	this.$html.on('executeRequest', this.roleDice.bind(this));

	this.$html.on('appendCharacterRequest', this.putCharacter.bind(this));
	
	this.$html.on('updateCharacterRequest', function(e) {
		var event = this.getAsyncEvent('tofRoomRequest').done(function(r){
			$(e.target).notify('情報が更新されました', {className: 'success', position: 'top'});
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
	
	this.$html.on('updateCharacterNameRequest', function(e) {
		var event = this.getAsyncEvent('tofRoomRequest').done(function(r){
			$(e.target).notify('名前が更新されました', {className: 'success', position: 'top'});
			e.resolve ? e.resolve(r) : false;
		}.bind(this)).fail(function(r){
			alert('名前の更新に失敗しました\n' + r.result);
			e.reject ? e.reject(r) : false;
		});
		
		event.method = 'updateCharacter';
		
		var oldName = this.nameList.append(e.id)
		var newName = this.nameList.append(e.id, e.value.name);
		
		e.value.parts.forEach(function(p){
			event.args = [{
				targetName:oldName + ':' + p.name,
				name:newName + ':' + p.name
			}];

			this.fireEvent(event);
		}.bind(this));
		
		$(e.target).notify('名前更新のリクエストを送信しました (' + e.value.name + ')', {className: 'info', position: 'top'});
	}.bind(this));
	
	this.$html.on('saveRequest', function(e){
		this.enemyList[e.value.name] = e.value;
		this.setStorage('enemy-list', this.enemyList);
		this.buildEnemyList();
	}.bind(this));
	
	this.$html.on('loadRequest', function(e){
		if(this.enemyList[e.value]) {
			e.resolve(this.enemyList[e.value]);
		} else {
			e.reject();
		}
	}.bind(this));

	this.$html.on('loadRequestAll', function(e){
		e.resolve(this.enemyList);
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
		this.fireEvent(this.getAsyncEvent('tofRoomRequest', {method: 'getChat', args: [0]}).done((result) => {
			e.resolve(result.chatMessageDataLog.reverse().slice(0, 15).map(function(log){return com.hiyoko.DodontoF.V2.fixChatMsg(log);}));
		}).fail((failed) => {
			e.reject(`<p>チャットログの取得に失敗しました<br/>理由： ${failed.result}</p>`);
		}));
		this.counterRemoCon.injectList(list);
	}.bind(this));
	
	this.$html.on('CounterRemoConChangeHP', function(e){
		var charDamage = com.hiyoko.util.groupArray(e.damages.values, function(v){return v.id;});
		for(var key in charDamage) {
			this.list[key].applyDamage(charDamage[key], e.damages.type, false);
		} 
	}.bind(this));
	
	this.getElementById('appendCharacter-saveCurrentStatus').click(this.saveCurrentStatus.bind(this));
	this.getElementById('appendCharacter-loadCurrentStatus').click(this.loadCurrentStatus.bind(this));
	
	this.$html.on('battleAddFromCharacterLister', this.appendCharacterFromCharacterList.bind(this));
	this.$html.on('battleDeleteFromCharacterLister', this.deleteCharacterFromCharacterList.bind(this));
};

com.hiyoko.sweet.Battle.prototype.appendCharacter = function() {
	var newId = com.hiyoko.util.rndString(8);
	
	this.$characters.append(com.hiyoko.util.format('<div class="%s" id="%s"></div>',
			this.id + '-character',
			this.id + '-character-' + newId));
	this.list[newId] = new com.hiyoko.sweet.Battle.BattleCharacter(this.getElementById('character-' + newId),
			{autocomplete:this.datalist.attr('id')});
	return newId;
};

com.hiyoko.sweet.Battle.prototype.destractAllCharacters = function() {
	com.hiyoko.util.forEachMap(this.list, function(v,k) {
		this.destractCharacter(k);
	}.bind(this));
};

com.hiyoko.sweet.Battle.prototype.destractCharacter = function(id) {
	this.list[id].$html.remove();
	this.nameList.remove(id);
	delete this.list[id];
};

com.hiyoko.sweet.Battle.prototype.saveCurrentStatus = function() {
	var result = [];
	com.hiyoko.util.forEachMap(this.list, function(v, k) {
		var c = (v.getValue());
		if(c.isAdded) {
			c.name = this.nameList.append(k);
		}
		result.push(c);
	}.bind(this));
	this.setStorage('current-status', result);
	return result;
};

com.hiyoko.sweet.Battle.prototype.loadCurrentStatus = function() {
	this.tofLoader.loadCharacters(function(characterNames) {
		this.getStorage('current-status', function(result){
			this.destractAllCharacters();
			result.forEach(function(v, i){
				var id = this.appendCharacter();
				this.list[id].setValue(v);
				if(v.isAdded) {
					if(characterNames.includes(v.name)) {
						this.list[id].afterAdd();
						this.nameList.append(id, v.name);
					} else {
						if(v.isHidden) {
							this.list[id].addToTofAsUnknown.click();
						} else {
							this.list[id].addToTof.click();
						}
					}
				}
			}.bind(this));
		}.bind(this));
	}.bind(this), function(result) {
		alert('読み込みに失敗しました\n原因：' + result.result);
	});
	
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


