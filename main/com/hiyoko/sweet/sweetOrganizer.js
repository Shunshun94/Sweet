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

com.hiyoko.sweet.Organizer.prototype.buildComponents = function() {
	if(this.query.url && this.query.room) {
		this.tofServerAccess = new com.hiyoko.DodontoF.V2.Server(this.query.url);
		this.tofRoomAccess = this.tofServerAccess.getRoom(this.query.room, this.query.pass);
		this.buildApplications(true);
		this.onClickList({num:0});
		this.tofRoomAccess.getRoomInfo()
		.done(function(r){
			this.getElementById('header').text('【' + r.roomName + '】');
		}.bind(this))
		.fail(function(r){
			alert('Couldn\'t get DodontoF Room Info. Is URL correct?');
			this.onClickList({num: (this.applications.length - 1)});
			this.list.disable();
		}.bind(this));
	} else {
		this.tofRoomAccess = com.hiyoko.DodontoF.V2.RoomDummy;
		this.buildApplications(false);
		this.onClickList({num: (this.applications.length - 1)});
		this.list.disable();
		this.pcManager.disable();
	}
};

com.hiyoko.sweet.Organizer.prototype.buildApplications = function(isActivated){
	var $apps = this.getElementById('apps').children('section');
	this.applications = com.hiyoko.util.mergeArray(
			com.hiyoko.sweet.Organizer.APPLICATION_LIST,
			$apps, 
			function(app, dom){return new app(dom);});
	this.pcManager = new com.hiyoko.sweet.PcManager(this.getElementById('pcs'));
	this.list = new com.hiyoko.sweet.AppList(this.getElement('#com-hiyoko-sweet-menu'), this.applications);
	if(isActivated) {
		this.responseChat = new com.hiyoko.sweet.ResponseChat(this.getElementById('responseChatBase'), {
			displayLimit: 15, system:'SwordWorld2.0'
		});
	}
};

com.hiyoko.sweet.Organizer.prototype.onClickList = function(e) {
	this.applications.forEach(function(app) {
		app.disable();
	});
	this.applications[e.num].enable();
	this.list.activateSelectedItem(e.num);
};

com.hiyoko.sweet.Organizer.prototype.onChangeRoomRequest = function(e){
	$('#entrance').hide();
	var url = './index.html?';
	url += 'url=' + e.value.url;
	url += '&room=' + e.value.room.no;
	if(e.value.room.isLocked) {
		url += '&pass=' + e.value.password.password;
	}
	localStorage.setItem(com.hiyoko.sweet.Entry.AlgorithmiaTokenStorage, JSON.stringify(e.value.option.algorithmia));
	
	document.location = url;
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
		com.hiyoko.VampireBlood.SW2.getSheet(event.sheet).done(event.resolve).fail(event.reject);
	});
	
	this.$html.on('algorithmiaRequest', function(e){
		var client = new com.hiyoko.Algorithmia(JSON.parse(localStorage.getItem(com.hiyoko.sweet.Entry.AlgorithmiaTokenStorage)));
		client.request(e.algorithm, e.params).then(function(res){e.resolve(res);}, function(err){e.reject(err)});
	});
	
	this.$html.on(com.hiyoko.component.InputFlow.Events.Finish, this.onChangeRoomRequest.bind(this));
	
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
	com.hiyoko.sweet.Entry
];
