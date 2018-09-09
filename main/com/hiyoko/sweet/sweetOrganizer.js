/**
 * Sweet Organizer
 */

var com = com || {};
com.hiyoko = com.hiyoko || {};
com.hiyoko.sweet = com.hiyoko.sweet || {};
com.hiyoko.sweet.Organizer = function($html) {
	this.query = com.hiyoko.util.getQueries();
	
	this.$html = $html;
	this.id = this.$html.attr('id');

	this.tofServerAccess;
	this.tofRoomAccess;

	this.applications;
	this.list;
	
	this.bindEvents();	
	this.buildComponents();

};
com.hiyoko.util.extend(com.hiyoko.component.ApplicationBase, com.hiyoko.sweet.Organizer);
com.hiyoko.sweet.Organizer.LongerPlatforms = ['discord'];
com.hiyoko.sweet.Organizer.prototype.buildComponents = function() {
	if(this.query.platform) {
		let query1 = com.hiyoko.util.getQueries();
		query1.url = query1.url || this.getElementById('dummy_s');
		let query2 = com.hiyoko.util.getQueries();
		query2.url = query2.url || this.getElementById('dummy_r');

		this.tofServerAccess = io.github.shunshun94.trpg.ServerClientFactory(query1);
		this.tofRoomAccess = io.github.shunshun94.trpg.RoomClientFactory(query2);
		setTimeout(()=>{
			this.buildApplications(this.query.platform);
			this.onClickList({num:0});
			const getRoomEvent = this.getAsyncEvent('dummyEvent', {
				method: 'getRoomInfo', args: {}
			}).done((r) => {
				const roomList = com.hiyoko.sweet.RoomList.updateList(
					(	localStorage.getItem(com.hiyoko.sweet.Organizer.ROOM_LIST_STORE) ?
						JSON.parse(localStorage.getItem(com.hiyoko.sweet.Organizer.ROOM_LIST_STORE)) : []  ),
					`${r.roomName} (${this.query.platform})`
				);
				localStorage.setItem(com.hiyoko.sweet.Organizer.ROOM_LIST_STORE, JSON.stringify(roomList));
				if(roomList.length > 1) {
					this.getElementById('header').append(`<span id="${this.id}-header-menu">▼</span>`);
					this.getElementById('header').append(`<div id="${this.id}-header-list"></div>`);
					this.roomList = new com.hiyoko.sweet.RoomList(this.getElementById('header-list'), {list: roomList});
					this.getElementById('header-menu').click((e) => {this.roomList.toggle();});
				}
				this.getElementById('header').append(`<span id="${this.id}-header-title"></span>`);
				this.getElementById('header-title').text(`【${r.roomName}】`);
			}).fail((r) => {
				this.onClickList({num: (this.applications.length - 1)});
				this.list.disable();
				if(this.query.platform === 'discord') {
					alert('Couldn\'t get Room Info. The token is incorrect or initial loading is failed.\nThis application will reload and try again.');
					document.location = document.location;
				} else {
					alert('Couldn\'t get Room Info. Is URL correct?');
				}
			});
			this.retriableRequest(getRoomEvent, 3);
		}, com.hiyoko.sweet.Organizer.LongerPlatforms.includes(this.query.platform) ? 3000 : 0);
	} else {
		this.tofRoomAccess = com.hiyoko.DodontoF.V2.RoomDummy;
		this.buildApplications(false);
		this.onClickList({num: (this.applications.length - 1)});
		this.list.disable();
	}
};

com.hiyoko.sweet.Organizer.prototype.buildApplications = function(platform){
	var $apps = this.getElementById('apps').children('section');
	this.applications = com.hiyoko.util.mergeArray(
			com.hiyoko.sweet.Organizer.APPLICATION_LIST,
			$apps, 
			(app, dom)=>{return new app(dom, this.query);});
	this.list = new com.hiyoko.sweet.AppList(this.getElement('#com-hiyoko-sweet-menu'), this.applications, platform);
	if(platform) {
		this.responseChat = new com.hiyoko.sweet.ResponseChat(this.getElementById('responseChatBase'), {
			displayLimit: 15, system:'SwordWorld2.0'
		});
		this.pcManager = new com.hiyoko.sweet.PcManager(this.getElementById('pcs'));
	} else {
		this.getElementById('pcs').hide();
		this.getElementById('responseChatBase').hide();
	}
};

com.hiyoko.sweet.Organizer.prototype.onClickList = function(e) {
	this.applications.forEach(function(app) {
		app.disable();
	});
	this.applications[e.num].enable();
	this.list.activateSelectedItem(e.num);
};

com.hiyoko.sweet.Organizer.prototype.retriableRequest = function(e, max, count = 0) {
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

com.hiyoko.sweet.Organizer.prototype.bindEvents = function(e) {
	var self = this;

	this.$html.on('tofRoomRequest', function(e){
		self.retriableRequest(e, 4);
	});

	this.$html.on(io.github.shunshun94.trpg.HiyokoSheetHandler.EVENTS.REQUEST, function(event) {
		if(event.sheet.startsWith('http')) {
			io.github.shunshun94.trpg.ytsheet.ytsheetSW2_5.getSheet(event.sheet).done(event.resolve).fail(event.reject);
		} else {
			com.hiyoko.VampireBlood.SW2.getSheet(event.sheet).done(event.resolve).fail(event.reject);
		}
	});

	this.$html.on('algorithmiaRequest', function(e){
		var client = new com.hiyoko.Algorithmia(JSON.parse(localStorage.getItem(com.hiyoko.sweet.Entry.AlgorithmiaTokenStorage)));
		client.request(e.algorithm, e.params).then(function(res){e.resolve(res);}, function(err){e.reject(err)});
	});

	this.$html.on('getStorage', function(e){
		e.callback(localStorage.getItem(e.key) ? JSON.parse(localStorage.getItem(e.key)) : null);
	});

	this.$html.on('setStorage', function(e){
		localStorage.setItem(e.id, JSON.stringify(e.value));
	});

	this.$html.on('clickMenu', this.onClickList.bind(this));
};

com.hiyoko.sweet.Organizer.APPLICATION_LIST = [
	com.hiyoko.sweet.Accounting,
	com.hiyoko.sweet.Battle,
	com.hiyoko.sweet.Circumstance,
	com.hiyoko.sweet.Discussion,
	com.hiyoko.sweet.Invite,
	com.hiyoko.sweet.Entry
];

com.hiyoko.sweet.Organizer.ROOM_LIST_STORE = 'com-hiyoko-sweet-room_list_store';
