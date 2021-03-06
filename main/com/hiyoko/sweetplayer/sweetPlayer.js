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
		alertify.error('部屋情報の取得に失敗しました。アクセス情報が間違っているかもしれません');
	}.bind(this));	
};

com.hiyoko.sweet.Player.prototype.buildComponents = function() {
	com.hiyoko.sweet.PlayerBattle.PlayerBattleOptionalTableLoader(this.query);
	if(this.query.platform && this.query.sheetId) {
		if(! this.hasInitTable(this.query)) {
			this.$html.addClass(`${this.id}-noTableExist`);
		}
		if(this.query.platform === 'discord') {
			if(this.query.url) {
				document.cookie = `discordtoken=${this.query.url}`;
				document.location = `./player.html?platform=discord&system=SwordWorld2.0&sheetId=${this.query.sheetId}&room=${this.query.room}&dicebot=${this.query.dicebot}`;
			}
			const discordTokenData = /discordtoken=([^;]+)/.exec(document.cookie);
			if(discordTokenData) {
				this.query.url = discordTokenData[1];
			} else {
				this.showEntryPage();
				return;
			}
		}
		const id = this.query.sheetId.replace(/\$/gm, '?').replace(/~/gm, '=');
		this.color = this.query.color || io.github.shunshun94.util.Color.getColorFromSeed(id).code.substr(1);
		const client = (this.query.sheetId.startsWith('http')) ? io.github.shunshun94.trpg.ytsheet.ytsheetSW2_5 : com.hiyoko.VampireBlood.SW2;
		client.getSheet(id).done(function(character){
			this.character = character;
			this.saveSheetIdList(id, this.character.name);
			this.query.url = this.query.url || this.getElementById('entrance');
			this.tofRoomAccess = io.github.shunshun94.trpg.RoomClientFactory(this.query);
			setTimeout(()=>{
				this.initRoomTitle();
				this.components = com.hiyoko.util.mergeArray(
						com.hiyoko.sweet.Player.Children.components,
						com.hiyoko.sweet.Player.Children.domIds, function(component, dom) {
							var newComponent = new component(this.getElementById(dom), this.character, this.query);
							newComponent.disable();
							return newComponent;
						}.bind(this));
				this.resources = new com.hiyoko.sweet.ResourceManage(this.getElementById('resourceManage'), this.character, this.query);
				this.talk = new com.hiyoko.sweet.Talk(this.getElementById('talk'), this.character, this.query);
				this.list = new com.hiyoko.sweet.AppList(this.getElementById('list'), this.components);
				this.selectBot = new com.hiyoko.sweet.SelectBot(this.getElementById('selectBot'), {character: this.character});
				this.onClickList({num: 0});
			}, 1500);
		}.bind(this));
	} else {
		this.showEntryPage();
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

com.hiyoko.sweet.Player.prototype.retriableRequest = function(e, max, count = 0) {
	this.tofRoomAccess[e.method].apply(this.tofRoomAccess, e.args).then(
			(result) => {
				if(count) {
					console.log(`PASSED ${e.method} (${count + 1} / ${max})`);
				}
				e.resolve(result);
			},
			(result) => {
				if((count !== max) && (! Boolean(result.suppressRetry))) {
					setTimeout(function() {
						this.retriableRequest(e, max, count + 1)
					}.bind(this), Math.pow(2, count) * 500);
					console.warn(`FAILED ${e.method} (${count + 1} / ${max}): ${result.result}`);
				} else {
					e.reject(result);
				}
			}
	);
};

com.hiyoko.sweet.Player.prototype.hasInitTable = (query) => {
	const platform = query.platform || '';
	return ['tof', 'DodontoF',　'とふ', 'どどんとふ'].includes(platform) || platform.endsWith('tof');
};

com.hiyoko.sweet.Player.prototype.bindEvents = function(e) {
	var self = this;
	
	this.$html.on('tofRoomRequest', function(e){
		if(e.method === 'sendChat') { 
			e.args[0].channel = e.args[0].channel || self.selectBot.getTab(); 
			e.args[0].color = self.color;
			e.args[0].bot = self.selectBot.getBot();
			e.args[0].name = e.args[0].name || self.character.name;
		}
		self.retriableRequest(e, 4);
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

	this.$html.on('isDamageEach', (e) => {e.resolve(this.components[0].isDamageEach());});
};

com.hiyoko.sweet.Player.prototype.showEntryPage = function() {
	this.$html.children('div').hide();
	new com.hiyoko.DodontoF.V2.Entrance(this.getElementById('entrance'));
	var list = this.loadSheetIdList();
	var $list = this.getElementById('entrance-option-sheetId-list');
	com.hiyoko.util.forEachMap(list, function(v, k) {
		$list.append(com.hiyoko.util.format('<option value="%s">%s</option>', k, v));
	});
	this.getElementById('entrance').show();
	new com.hiyoko.sweet.PlayerEntrance(this.getElementById('entrance'));
};
