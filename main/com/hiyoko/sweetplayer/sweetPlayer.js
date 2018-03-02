var com = com || {};
com.hiyoko = com.hiyoko || {};
com.hiyoko.sweet = com.hiyoko.sweet || {};
com.hiyoko.sweet.Player = function($html) {
	this.query = com.hiyoko.util.getQueries();
	
	this.$html = $html;
	this.id = this.$html.attr('id');
	this.components = [];
	this.tofRoomAccess;
	
	this.bindEvents();	
	this.buildComponents();
};

com.hiyoko.util.extend(com.hiyoko.component.ApplicationBase, com.hiyoko.sweet.Player);

com.hiyoko.sweet.Player.Children = {
	components: [com.hiyoko.sweet.PlayerBattle, com.hiyoko.sweet.Pet, com.hiyoko.sweet.CommonCheck, com.hiyoko.sweet.Links],
	domIds: ['playerbattle', 'pet', 'commoncheck', 'links']
};

com.hiyoko.sweet.Player.prototype.initRoomTitle = function() {
	this.tofRoomAccess.getRoomInfo()
	.done(function(r){
		this.getElementById('title').text('【' + this.character.name + ' @ ' + r.roomName + '】');
	}.bind(this))
	.fail(function(r){
		alert('Couldn\'t get DodontoF Room Info. Is URL correct?');
	}.bind(this));	
};

com.hiyoko.sweet.Player.prototype.buildComponents = function() {
	if(this.query.url && this.query.room && this.query.sheetId) {
		com.hiyoko.VampireBlood.SW2.getSheet(this.query.sheetId).done(function(character){
			this.character = character;
			this.saveSheetIdList(this.query.sheetId, this.character.name);
			this.tofRoomAccess = new com.hiyoko.DodontoF.V2.Room(this.query.url, this.query.room, this.query.pass);
			this.initRoomTitle();
			
			this.components = com.hiyoko.util.mergeArray(
					com.hiyoko.sweet.Player.Children.components,
					com.hiyoko.sweet.Player.Children.domIds, function(component, dom) {
						var newComponent = new component(this.getElementById(dom), this.character);
						newComponent.disable();
						return newComponent;
					}.bind(this));
			this.resources = new com.hiyoko.sweet.ResourceManage(this.getElementById('resourceManage'), this.character);
			this.talk = new com.hiyoko.sweet.Talk(this.getElementById('talk'), this.character);
			this.list = new com.hiyoko.sweet.AppList(this.getElementById('list'), this.components);
			this.onClickList({num: 0});
		}.bind(this));
	} else {
		this.$html.children('div').hide();
		new com.hiyoko.DodontoF.V2.Entrance(this.getElementById('entrance'));
		var list = this.loadSheetIdList();
		var $list = this.getElementById('entrance-option-sheetId-list');
		com.hiyoko.util.forEachMap(list, function(v, k) {
			$list.append(com.hiyoko.util.format('<option value="%s">%s</option>', k, v));
		});
		this.getElementById('entrance').show();
	}
};

com.hiyoko.sweet.Player.prototype.loadSheetIdList = function() {
	return JSON.parse(localStorage.getItem(com.hiyoko.sweet.Player.SheetIdListKey)) || {};
};

com.hiyoko.sweet.Player.prototype.saveSheetIdList = function(id, name) {
	var data = this.loadSheetIdList();
	data[id] = name;
	localStorage.setItem(com.hiyoko.sweet.Player.SheetIdListKey, JSON.stringify(data));
	return data;
};

com.hiyoko.sweet.Player.SheetIdListKey = 'com-hiyoko-sw2-player-entrance-option-sheetId-list';

com.hiyoko.sweet.Player.prototype.onClickList = function(e) {
	this.components.forEach(function(app) {
		app.disable();
	});
	this.components[e.num].enable();
	this.list.activateSelectedItem(e.num);
}; 

com.hiyoko.sweet.Player.prototype.bindEvents = function(e) {
	var self = this;
	
	this.$html.on('tofRoomRequest', function(e){
		self.tofRoomAccess[e.method].apply(self.tofRoomAccess, e.args).done(e.resolve).fail((data, text, error) => {
			if(data.result) {
				e.reject(data, text, error);
			} else {
				if(text === 'error' && error === 'error') {
					console.log(data)
					e.reject({
						result: `${io.github.shunshun94.util.HTTP_STATUS_CODES[data.status]}`,
						detail: data
					});
				} else {
					e.reject({
						result: `${text} (${error})`,
						detail: data
					});
				}
			}
			console.warn('request is failed', JSON.stringify(e), JSON.stringify(data), JSON.stringify(text), JSON.stringify(error));
		});
	});
	
	this.$html.on('getStorage', function(e){
		e.callback(localStorage.getItem(e.key) ? JSON.parse(localStorage.getItem(e.key)) : null);
	});
	
	this.$html.on('setStorage', function(e){
		localStorage.setItem(e.id, JSON.stringify(e.value));
	});

	this.$html.on('getStorageWithKey', function(e){
		e.resolve(com.hiyoko.util.getLocalStorage(e.id, e.key));
	});
	
	this.$html.on('setStorageWithKey', function(e){
		e.resolve(com.hiyoko.util.updateLocalStorage(e.id, e.key, e.value));
	});
	
	this.$html.on('clickMenu', this.onClickList.bind(this));
	
	this.$html.on(com.hiyoko.component.InputFlow.Events.Finish, function(e) {
		var url = './player.html?';
		url += '&url=' + e.value.url;
		url += '&room=' + e.value.room.no;
		url += '&sheetId=' + e.value.option.sheetId;
		if(e.value.room.isLocked) {
			url += '&pass=' + e.value.password.password;
		}
		document.location = url;
	});
};


