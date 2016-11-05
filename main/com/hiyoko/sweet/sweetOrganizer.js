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

	//this.sheetAccess;
	//this.sheetParser;
	//this.userData;

	this.applications;
	this.list;
	
	this.bindEvents();	
	this.buildComponents();

};
com.hiyoko.util.extend(com.hiyoko.sweet.ApplicationBase, com.hiyoko.sweet.Organizer);

com.hiyoko.sweet.Organizer.prototype.buildComponents = function() {
	if(this.query.url && this.query.room) {
		this.tofServerAccess = new com.hiyoko.DodontoF.V2.Server(this.query.url);
		this.tofRoomAccess = this.tofServerAccess.getRoom(this.query.room, this.query.pass);
		this.buildApplications();
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
		this.buildApplications();
		this.onClickList({num: (this.applications.length - 1)});
		this.list.disable();
	}


};

com.hiyoko.sweet.Organizer.prototype.buildApplications = function(){
	var $apps = this.getElementById('apps').children();
	this.applications = com.hiyoko.util.mergeArray(
			com.hiyoko.sweet.Organizer.APPLICATION_LIST,
			$apps, 
			function(app, dom){return new app(dom);});
	this.list = new com.hiyoko.sweet.AppList(this.getElement('#com-hiyoko-sweet-menu'), this.applications);
}

com.hiyoko.sweet.Organizer.prototype.onClickList = function(e) {
	this.applications.forEach(function(app) {
		app.disable();
	});
	this.applications[e.num].enable();
	this.list.activateSelectedItem(e.num);
};

com.hiyoko.sweet.Organizer.prototype.bindEvents = function(e) {
	var self = this;
	
	this.$html.on('tofRoomRequest', function(e){
		self.tofRoomAccess[e.method].apply(self.tofRoomAccess, e.args).done(e.resolve).fail(e.reject);
	});
	
	this.$html.on('getStorage', function(e){
		e.callback(localStorage.getItem(e.key) ? JSON.parse(localStorage.getItem(e.key)) : null);
	});
	
	this.$html.on('setStorage', function(e){
		localStorage.setItem(e.id, JSON.stringify(e.value));
	});
	
	
	this.$html.on('clickMenu', this.onClickList.bind(this));
};

com.hiyoko.sweet.Organizer.APPLICATION_LIST = [com.hiyoko.sweet.Circumstance, com.hiyoko.sweet.Discussion, com.hiyoko.sweet.Entry];


